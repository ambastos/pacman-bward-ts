import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, 'app', 'configs', 'game.config')
const port = process.env.PORT || process.env.port || 8080

const app = express()
app.use(express.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/api/config', async function (req, res) {
  try {
    const content = await fs.readFile(configPath, 'utf8')
    res.type('txt').send(content)
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
    await fs.mkdir(path.dirname(configPath), { recursive: true })
    await fs.writeFile(configPath, content, 'utf8')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'failed to write config file' })
  }
})

app.use(express.static(__dirname))

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})