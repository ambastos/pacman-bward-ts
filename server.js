import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, 'app', 'configs', 'game.config')
const modsDir = path.join(__dirname, 'app', 'mods', 'implementations')
const port = process.env.PORT || process.env.port || 8080

function modConfigPath(name) {
  return path.join(modsDir, String(name), 'app', 'configs', 'game.config')
}

function parseValue(raw) {
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map((s) => parseValue(s.trim()))
  }
  if (raw === 'true') return true
  if (raw === 'false') return false
  const quote = raw[0] ?? ''
  if (quote === '"' || quote === "'") {
    return raw.slice(1, raw.lastIndexOf(raw[0]))
  }
  const num = Number(raw)
  if (raw !== '' && !Number.isNaN(num)) return num
  return raw
}

function parseConfig(text) {
  const out = {}
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

function serializeValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map((v) => (typeof v === 'string' ? `'${v}'` : v)).join(',')}]`
  }
  if (typeof value === 'string') return `"${value}"`
  return String(value)
}

function fmtLine(key, value) {
  return `${key}=${serializeValue(value)}`
}

function effectiveMods(parsed) {
  const mods = parsed['game.mods']
  return Array.isArray(mods) ? mods.map(String).filter((m) => m !== 'none') : []
}

/**
 * Maps a default key like `game.default.lives` onto its applied key
 * (e.g. `game.pacman.lives`) by stripping the `default.` segment. When
 * the remaining path has no segment (legacy single-segment defaults), it
 * falls back to trailing-suffix matching against applied keys. A default
 * always resolves to a target, so it seeds applied keys that are not
 * written in the config file.
 */
function resolveDefaultKey(defaultKey, parsed, namespace = 'game') {
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

function splitDefaultsAndApplied(parsed, namespace = 'game') {
  const defaults = {}
  const applied = {}
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

async function readModConfig(name) {
  const text = await fs.readFile(modConfigPath(name), 'utf8')
  return splitDefaultsAndApplied(parseConfig(text), name)
}

async function mergeConfig() {
  const gameText = await fs.readFile(configPath, 'utf8')
  const gameParsed = parseConfig(gameText)
  const game = splitDefaultsAndApplied(gameParsed, 'game')

  const appliedMods = effectiveMods(gameParsed)
  const mods = Array.isArray(gameParsed['game.mods']) ? gameParsed['game.mods'].map(String) : []
  const modName = game.applied['game.mod'] ?? game.defaults['game.mod'] ?? 'none'

  let modDefaults = {}
  let modApplied = {}
  if (modName !== 'none') {
    try {
      const mod = await readModConfig(modName)
      modDefaults = mod.defaults
      modApplied = mod.applied
    } catch {
      // mod config not found, use defaults only
    }
  }

  const config = {
    ...game.defaults,
    ...modDefaults,
    ...game.applied,
    ...modApplied,
  }
  return {
    defaults: { ...game.defaults, ...modDefaults },
    config,
    mods: mods.length ? mods : ['none', ...appliedMods],
  }
}

function serializeSection(pairs) {
  return pairs.map(([key, value]) => fmtLine(key, value))
}

function splitAppliedByMod(parsed, config) {
  const namespaces = effectiveMods(config)
  const gameKeys = []
  const byMod = {}
  Object.entries(parsed).forEach(([key, value]) => {
    const owned = namespaces.find((name) => key.startsWith(`${name}.`))
    if (owned) {
      ;(byMod[owned] ??= []).push([key, value])
    } else {
      gameKeys.push([key, value])
    }
  })
  return { gameKeys, byMod }
}

const app = express()
app.use(express.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Versao em texto/ASCII do jogo. Carrega o mesmo build/app.js e desenha num
// canvas 2D, sem mexer no index.html nem no renderer PIXI.
app.get('/text', function (req, res) {
  res.sendFile(path.join(__dirname, 'index-text.html'))
})

app.get('/api/config', async function (req, res) {
  try {
    const merged = await mergeConfig()
    res.json(merged)
  } catch (err) {
    res.status(404).json({ error: 'config file not found' })
  }
})

app.post('/api/config', async function (req, res) {
  const content = req.body?.config
  if (typeof content !== 'string') {
    res.status(400).json({ error: 'missing "config" field' })
    return
  }
  try {
    const parsed = parseConfig(content)
    let existing = {}
    try {
      existing = parseConfig(await fs.readFile(configPath, 'utf8'))
    } catch {
      // no existing file yet
    }
    const { gameKeys, byMod } = splitAppliedByMod(parsed, { 'game.mods': existing['game.mods'] ?? ['none'] })

    const original = await fs.readFile(configPath, 'utf8').catch(() => '')
    const lines = original.split(/\r?\n/)
    const marker = lines.findIndex((l) => l.trim().startsWith('#') && /real applied values/i.test(l.trim()))
    const section = serializeSection(gameKeys)
    let nextText
    if (marker >= 0) {
      nextText = lines.slice(0, marker + 1).join('\n') + '\n' + section.join('\n') + '\n'
    } else {
      nextText =
        '# pacman-bward configuration\n# Each line follows the format key=value\n# Lines starting with # are ignored.\n\n' +
        section.join('\n') +
        '\n'
    }
    await fs.writeFile(configPath, nextText, 'utf8')

    for (const name of Object.keys(byMod)) {
      if (!byMod[name].length) continue
      const modText =
        `# ${name} mod configuration\n# Each line follows the format key=value\n# Lines starting with # are ignored.\n\n` +
        serializeSection(byMod[name]).join('\n') +
        '\n'
      await fs.mkdir(path.dirname(modConfigPath(name)), { recursive: true })
      await fs.writeFile(modConfigPath(name), modText, 'utf8')
    }

    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'failed to write config file' })
  }
})

app.use(express.static(__dirname))

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})