import GameCoordinator from "../core/gameCoordinator.ts"
import Debugger from "./debugger.ts"
import EmptyMod from "../mod/empty-mod.ts"
import { mods } from "../mod/mod.ts"


const GHOST_NAMES = ['blinky', 'pinky', 'inky', 'clyde']

const MODS: Record<string, any> = {  
  none: EmptyMod,
}

function parseValue(raw: string): any {
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((s): any => parseValue(s.trim()))
  }
  if (raw === 'true') return true
  if (raw === 'false') return false
  const quote = raw[0] ?? ''
  if (quote === '"' || quote === "'") {
    return raw.slice(1, raw.lastIndexOf(raw[0]!))
  }
  const num = Number(raw)
  if (raw !== '' && !Number.isNaN(num)) return num
  return raw
}

function parseConfig(text: string): Record<string, any> {
  const out: Record<string, any> = {}
  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eq = trimmed.indexOf('=')
    if (eq <= 0) return
    const key = trimmed.substring(0, eq).trim()
    const raw = trimmed.substring(eq + 1).trim()
    out[key] = parseValue(raw)
  })
  return out
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    return res.ok ? await res.text() : null
  } catch {
    return null
  }
}

/**
 * Maps a default key like `game.default.lives` onto its applied key
 * (e.g. `game.pacman.lives`) by stripping the `default.` segment. When
 * the remaining path has no segment (legacy single-segment defaults), it
 * falls back to trailing-suffix matching against applied keys. A default
 * always resolves to a target, so it seeds applied keys that are not
 * written in the config file.
 */
function resolveDefaultKey(
  defaultKey: string,
  parsed: Record<string, any>,
  namespace = 'game',
): string | undefined {
  const prefix = `${namespace}.default.`
  if (!defaultKey.startsWith(prefix)) return undefined
  const rest = defaultKey.slice(prefix.length)
  const exact = `${namespace}.${rest}`
  if (rest.includes('.')) return exact
  const candidates = Object.keys(parsed).filter(
    (k) => k.startsWith(`${namespace}.`) && !k.startsWith(`${namespace}.default.`),
  )
  if (candidates.includes(exact)) return exact
  const restSegs = rest.split('.')
  return (
    candidates.find((k) => {
      const segs = k.split('.')
      return (
        segs.length >= restSegs.length &&
        segs.slice(-restSegs.length).join('.') === restSegs.join('.')
      )
    }) ?? exact
  )
}

function splitDefaultsAndApplied(
  parsed: Record<string, any>,
  namespace = 'game',
): { defaults: Record<string, any>; applied: Record<string, any> } {
  const defaults: Record<string, any> = {}
  const applied: Record<string, any> = {}
  const defaultPrefix = `${namespace}.default.`
  const appliedPrefix = `${namespace}.`
  Object.entries(parsed).forEach(([key, value]) => {
    if (key.startsWith(defaultPrefix)) {
      const target = resolveDefaultKey(key, parsed, namespace)
      if (target) defaults[target] = value
    } else if (key.startsWith(appliedPrefix)) {
      applied[key] = value
    }
  })
  return { defaults, applied }
}

/**
 * Reassembles the merged config from the raw game config text and the
 * active mod config text (used only as a fallback when the server is gone).
 */
function mergeFromSources(
  gameText: string | null,
  mods: string[],
  modTexts: Record<string, string | null>,
): { defaults: Record<string, any>; config: Record<string, any>; mods: string[] } {
  const game = splitDefaultsAndApplied(parseConfig(gameText ?? ''), 'game')
  const defaults: Record<string, any> = { ...game.defaults }
  const applied: Record<string, any> = { ...game.applied }
  mods.forEach((name) => {
    const text = modTexts[name]
    if (text == null) return
    const mod = splitDefaultsAndApplied(parseConfig(text), name)
    Object.assign(defaults, mod.defaults)
    Object.assign(applied, mod.applied)
  })
  return {
    defaults,
    config: { ...defaults, ...applied },
    mods: mods.length ? mods : ['none'],
  }
}

interface MergedConfig {
  defaults: Record<string, any>
  config: Record<string, any>
  mods: string[]
}

class SettingsManager {
  gc: GameCoordinator
  config: Record<string, any> = {}
  defaults: Record<string, any> = {}
  mods: string[] = []
  subscribed = false

  constructor(gameCoordinator: GameCoordinator) {
    this.gc = gameCoordinator
  }

  serialize(): string {
    const lines: string[] = [
      '# pacman-bward configuration',
      '# Each line follows the format key=value',
      '# Lines starting with # are ignored.',
      '',
    ]
    Object.keys(this.config).forEach((key) => {
      const value = this.config[key]
      if (Array.isArray(value)) {
        lines.push(`${key}=[${value.map((v) => (typeof v === 'string' ? `'${v}'` : v)).join(',')}]`)
      } else if (typeof value === 'string') {
        lines.push(`${key}="${value}"`)
      } else {
        lines.push(`${key}=${value}`)
      }
    })
    return lines.join('\n')
  }

  async load(): Promise<void> {
    let merged: MergedConfig | null = null
    try {
      const res = await fetch('/api/config')
      if (res.ok) merged = await res.json()
    } catch {
      // server unavailable
    }
    if (merged == null) merged = await this.loadFromFiles()

    this.defaults = merged.defaults ?? {}
    this.mods = Array.isArray(merged.mods) ? merged.mods.map(String) : []
    this.config = { ...this.defaults, ...(merged.config ?? {}) }
    this.populateModOptions()
  }

  private async loadFromFiles(): Promise<MergedConfig> {
    const gameText = await fetchText('app/configs/game.config')
    const gameParsed = parseConfig(gameText ?? '')
    const mods = Array.isArray(gameParsed['game.mods'])
      ? gameParsed['game.mods'].map(String)
      : []
    // Mods nao ficam mais neste repositorio, entao nao ha um caminho de
    // config previsivel para buscar. Um mod registrado em `mods` traz os
    // proprios defaults; `modTexts` fica vazio e mergeFromSources ignora.
    const modTexts: Record<string, string | null> = {}
    return mergeFromSources(gameText, mods, modTexts)
  }

  async save(): Promise<boolean> {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: this.serialize() }),
      })
      if (res.ok) {
        this.notify('Saved!')
        return true
      }
    } catch {
      // no server endpoint, fall back to localStorage
    }
    try {
      localStorage.setItem('pacman-config', this.serialize())
      this.notify('Saved (local)')
      return true
    } catch {
      this.notify('Save failed')
      return false
    }
  }

  get(key: string): any {
    return this.config[key]
  }

  getNum(key: string): number {
    const value = this.config[key]
    const num = typeof value === 'number' ? value : Number(value)
    return Number.isNaN(num) ? 0 : num
  }

  getBool(key: string): boolean {
    return !!this.config[key]
  }

  getStr(key: string): string {
    const value = this.config[key]
    return value == null ? '' : String(value)
  }

  getList(key: string): string[] {
    const value = this.config[key]
    return Array.isArray(value) ? value.map(String) : []
  }

  set(key: string, value: any) {
    this.config[key] = value
  }

  apply() {
    this.applyMod()
    this.applyDebug()
    this.applyGame()
    this.applyGhosts()    
    this.applyDebuggerFlags()
  }

  applyMod() {
    const name = this.getStr('game.mod') || 'none'
    const Ctor = MODS[name] || mods[name] || EmptyMod
    if (this.gc.mod && this.gc.mod.name === name) return
    this.gc.mod?.stop?.()
    this.gc.setMod(new Ctor(this.gc))
    if (this.gc.gameEngine?.started) {
      this.gc.mod.initialize()
      this.gc.mod.start()
    }
  }

  applyDebug() {
    const enabled = this.getBool('game.debug')
    this.gc.debug = enabled
    if (enabled && !window.debug) {
      window.debug = new Debugger(this.gc, this)
    } else if (!enabled && window.debug) {
      window.debug.destroy()
      window.debug = null
    }
  }

  toggleDebug(enabled: boolean) {
    this.set('game.debug', enabled)
    this.applyDebug()
    this.save()
  }

  applyGame() {
    const lives = this.getNum('game.pacman.lives')
    const level = this.getNum('game.level')
    this.gc.lives = lives
    this.gc.level = level
    this.syncStore()
    this.applyPacman()
  }

  private syncStore() {
    const store: any = this.gc.settingsStore || {}
    store.lives = this.getNum('game.pacman.lives')
    store.level = this.getNum('game.level')
    store.onEmitterReady = store.onEmitterReady || ((emitter: any) => this.subscribe(emitter))
    this.gc.settingsStore = store
  }

  applyPacman() {
    const pacman = this.gc.pacman
    if (!pacman) return
    const immortal = this.getBool('game.pacman.immortality')
    ;(pacman as any).immortal = immortal
    pacman.allowCollision = !immortal
  }

  applyGhosts() {
    const ghosts = this.gc.ghosts
    if (!Array.isArray(ghosts)) return
    const disabled = this.getList('game.ghosts.disabled').map((s) => s.toLowerCase())
    ghosts.forEach((ghost) => {
      const name = String(ghost.name ?? '').toLowerCase()
      const hide = disabled.includes(name)
      ghost.display = !hide
      if (hide) {
        ghost.moving = false
        ghost.allowCollision = false
      } else {
        ghost.allowCollision = true
      }
    })
  }

  applyDebuggerFlags() {
    if (!window.debug) return
    window.debug.shouldPrintGrid = this.getBool('game.debugGrid')
    window.debug.enableBoundsAndHitBoxes = this.getBool('game.debugBounds')
  }

  subscribe(emitter?: any) {
    const em = emitter || this.gc.emitter
    if (this.subscribed || !em) return
    this.subscribed = true
    const handler = () => {
      this.applyGhosts()
      this.applyPacman()
      this.applyDebuggerFlags()
    }
    em.on('post-start', handler)
    em.on('post-death', handler)
    em.on('post-advance-level', handler)
  }

  private populateModOptions() {
    const sel = $('#cfg-mod')
    if (!sel.length) return
    const list = this.mods.length ? this.mods : ['none']
    sel.empty()
    list.forEach((name) => {
      const label = name === 'none' ? 'None' : name.charAt(0).toUpperCase() + name.slice(1)
      $('<option>').val(name).text(label).appendTo(sel)
    })
  }

  private clampLives(n: number): number {
    return Math.max(0, Math.floor(n))
  }

  private clampLevel(n: number): number {
    return Math.max(1, Math.floor(n))
  }

  private refreshExtraLives() {
    try {
      this.gc.updateExtraLivesDisplay()
    } catch {
      // ui not ready yet, ignore
    }
  }

  private updateGhostsSelection() {
    const disabled = GHOST_NAMES.filter((name) => !$(`#dbg-ghost-${name}`).is(':checked'))
    this.set('game.ghosts.disabled', disabled)
    this.applyGhosts()
    this.save()
  }

  initUi() {
    const openSettings = () => {
      this.refreshSettingsPanel()
      this.show('settings-modal')
    }
    $('#config-btn-menu').on('click', openSettings)
    $('#config-btn-game').on('click', openSettings)
    $('#settings-close').on('click', () => this.hide('settings-modal'))
    $('#debug-close').on('click', () => this.hide('debug-modal'))    

    $('#cfg-debug').on('change', (e: JQuery.ChangeEvent) => {
      this.toggleDebug(!!($(e.target) as JQuery<HTMLInputElement>).is(':checked'))
      this.refreshModDots()
    })
    $('#cfg-mod').on('change', (e: JQuery.ChangeEvent) => {
      this.set('game.mod', ($(e.target) as JQuery<HTMLSelectElement>).val())
      this.applyMod()
      this.save()
      this.refreshModDots()
      if (this.gc.gameEngine?.started) {
        this.notify('Mod válido no próximo início')
      }
    })
    $('#cfg-debug-dots').on('click', () => {
      this.refreshDebugPanel()
      this.show('debug-modal')
    })
    
    $('#dbg-lives').on('change', (e: JQuery.ChangeEvent) => {
      const n = this.clampLives(Number($(e.target).val()))
      this.set('game.pacman.lives', n)
      this.applyGame()
      this.refreshExtraLives()
      this.save()
    })
    $('#dbg-level').on('change', (e: JQuery.ChangeEvent) => {
      const n = this.clampLevel(Number($(e.target).val()))
      this.set('game.level', n)
      this.applyGame()
      this.save()
    })
    $('#dbg-immortality').on('change', (e: JQuery.ChangeEvent) => {
      const checked = !!($(e.target) as JQuery<HTMLInputElement>).is(':checked')
      this.set('game.pacman.immortality', checked)
      this.applyPacman()
      this.save()
    })
    $('#dbg-bounds').on('change', (e: JQuery.ChangeEvent) => {
      const checked = !!($(e.target) as JQuery<HTMLInputElement>).is(':checked')
      this.set('game.debugBounds', checked)
      if (window.debug) window.debug.enableBoundsAndHitBoxes = checked
      this.save()
    })
    $('#dbg-grid').on('change', (e: JQuery.ChangeEvent) => {
      const checked = !!($(e.target) as JQuery<HTMLInputElement>).is(':checked')
      this.set('game.debugGrid', checked)
      if (window.debug) window.debug.shouldPrintGrid = checked
      this.save()
    })

    GHOST_NAMES.forEach((name) => {
      $(`#dbg-ghost-${name}`).on('change', () => this.updateGhostsSelection())
    })
    
  }

  refreshSettingsPanel() {
    this.populateModOptions()
    $('#cfg-debug').prop('checked', this.getBool('game.debug'))
    $('#cfg-mod').val(this.getStr('game.mod') || 'none')
    this.refreshModDots()
  }

  refreshModDots() {
    $('#cfg-debug-dots').prop('disabled', !this.getBool('game.debug'))    
  }

  refreshDebugPanel() {
    $('#dbg-lives').val(this.getNum('game.pacman.lives'))
    $('#dbg-level').val(this.getNum('game.level'))
    $('#dbg-immortality').prop('checked', this.getBool('game.pacman.immortality'))
    $('#dbg-bounds').prop('checked', this.getBool('game.debugBounds'))
    $('#dbg-grid').prop('checked', this.getBool('game.debugGrid'))
    const disabled = this.getList('game.ghosts.disabled').map((s) => s.toLowerCase())
    GHOST_NAMES.forEach((name) => {
      $(`#dbg-ghost-${name}`).prop('checked', !disabled.includes(name))
    })
  }
  
  private show(id: string) {
    $(`#${id}`).addClass('open')
  }

  private hide(id: string) {
    $(`#${id}`).removeClass('open')
  }

  private notify(msg: string) {
    const tip = document.getElementById('settings-tip')
    if (!tip) return
    tip.textContent = msg
    tip.style.opacity = '1'
    window.setTimeout(() => {
      tip.style.opacity = '0'
    }, 2000)
  }
}

export default SettingsManager