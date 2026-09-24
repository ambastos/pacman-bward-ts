import GameCoordinator from "../core/gameCoordinator.ts"
import Debugger from "./debugger.ts"
import FloodModImp from "../../mods/implementations/flood-mod-imp.ts"
import EmptyMod from "../../mods/empty-mod.ts"

const GHOST_NAMES = ['blinky', 'pinky', 'inky', 'clyde']

const MODS: Record<string, any> = {
  flood: FloodModImp,
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

class SettingsManager {
  gc: GameCoordinator
  config: Record<string, any> = {}
  subscribed = false

  private keyOrder = [
    'game.pacman.lives',
    'game.pacman.immortality',
    'game.ghosts.disabled',
    'game.level',
    'game.mod',
    'game.debug',
    'game.debugBounds',
    'game.debugGrid',
    'flood.waveIntervalMin',
    'flood.waveIntervalMax',
    'flood.pacmanBreathing',
    'flood.ghostsBreathing',
  ]

  private defaults: Record<string, any> = {
    'game.pacman.lives': 2,
    'game.pacman.immortality': false,
    'game.ghosts.disabled': [],
    'game.level': 1,
    'game.mod': 'flood',
    'game.debug': true,
    'game.debugBounds': false,
    'game.debugGrid': false,
    'flood.waveIntervalMin': 10,
    'flood.waveIntervalMax': 30,
    'flood.pacmanBreathing': 10,
    'flood.ghostsBreathing': 10,
  }

  constructor(gameCoordinator: GameCoordinator) {
    this.gc = gameCoordinator
    this.config = { ...this.defaults }
  }

  parse(text: string): Record<string, any> {
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

  serialize(): string {
    const lines: string[] = [
      '# pacman-bward configuration',
      '# Each line follows the format key=value',
      '# Lines starting with # are ignored.',
      '',
    ]
    this.keyOrder.forEach((key) => {
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
    let text: string | null = null
    try {
      const res = await fetch('/api/config')
      if (res.ok) text = await res.text()
    } catch {
      // server unavailable
    }
    if (text == null) {
      try {
        const res = await fetch('app/configs/game.config')
        if (res.ok) text = await res.text()
      } catch {
        // file unavailable, use defaults
      }
    }
    const parsed = text != null ? this.parse(text) : {}
    this.config = { ...this.defaults, ...parsed }
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
    this.applyFlood()
    this.applyDebuggerFlags()
  }

  applyMod() {
    const name = this.getStr('game.mod') || 'flood'
    const Ctor = MODS[name] || EmptyMod
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

  applyFlood() {
    const flood = (this.gc.mod as any)?.flood
    if (!flood) return
    flood.waveIntervalMin = this.getNum('flood.waveIntervalMin') || 10
    flood.waveIntervalMax = this.getNum('flood.waveIntervalMax') || 30
    flood.pacmanMaxBreathing = this.getNum('flood.pacmanBreathing') || 10
    flood.ghostsMaxBreathing = this.getNum('flood.ghostsBreathing') || 10
    if (flood.wavesManager) {
      flood.wavesManager.setPacmanMaxBreathing(flood.pacmanMaxBreathing)
      flood.wavesManager.setGhostsMaxBreathing(flood.ghostsMaxBreathing)
    }
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

  private updateFlood() {
    this.set('flood.waveIntervalMin', this.clampLives(Number($('#flood-wave-min').val()) || 0))
    this.set('flood.waveIntervalMax', this.clampLives(Number($('#flood-wave-max').val()) || 0))
    this.set('flood.pacmanBreathing', this.clampLives(Number($('#flood-pac-breath').val()) || 0))
    this.set('flood.ghostsBreathing', this.clampLives(Number($('#flood-ghosts-breath').val()) || 0))
    this.applyFlood()
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
    $('#flood-close').on('click', () => this.hide('flood-modal'))

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
    $('#cfg-mod-dots').on('click', () => {
      this.refreshFloodPanel()
      this.show('flood-modal')
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

    $('#flood-wave-min').on('change', () => this.updateFlood())
    $('#flood-wave-max').on('change', () => this.updateFlood())
    $('#flood-pac-breath').on('change', () => this.updateFlood())
    $('#flood-ghosts-breath').on('change', () => this.updateFlood())
  }

  refreshSettingsPanel() {
    $('#cfg-debug').prop('checked', this.getBool('game.debug'))
    $('#cfg-mod').val(this.getStr('game.mod') || 'flood')
    this.refreshModDots()
  }

  refreshModDots() {
    $('#cfg-debug-dots').prop('disabled', !this.getBool('game.debug'))
    $('#cfg-mod-dots').prop('disabled', this.getStr('game.mod') !== 'flood')
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

  refreshFloodPanel() {
    $('#flood-wave-min').val(this.getNum('flood.waveIntervalMin'))
    $('#flood-wave-max').val(this.getNum('flood.waveIntervalMax'))
    $('#flood-pac-breath').val(this.getNum('flood.pacmanBreathing'))
    $('#flood-ghosts-breath').val(this.getNum('flood.ghostsBreathing'))
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