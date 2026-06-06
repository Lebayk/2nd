/**
 * Serveur de persistance — lit/écrit data/state.json
 * Aucune dépendance externe, Node.js stdlib uniquement.
 * Vite proxie /api → http://localhost:3001 en dev.
 */
import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR   = join(__dirname, 'data')
const STATE_FILE = join(DATA_DIR, 'state.json')
const PORT = 3001

mkdirSync(DATA_DIR, { recursive: true })

function readState() {
  try { return readFileSync(STATE_FILE, 'utf-8') } catch { return 'null' }
}

function writeState(raw) {
  writeFileSync(STATE_FILE, raw, 'utf-8')
}

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  // GET /api/state — renvoie le state sauvegardé
  if (req.url === '/api/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(readState())
    return
  }

  // POST /api/state — écrase le state
  if (req.url === '/api/state' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        JSON.parse(body) // valide le JSON avant d'écrire
        writeState(body)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end('{"ok":true}')
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end('{"error":"invalid json"}')
      }
    })
    return
  }

  // DELETE /api/state — remet à zéro
  if (req.url === '/api/state' && req.method === 'DELETE') {
    writeState('null')
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end('{"ok":true}')
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  console.log(`\x1b[32m✓\x1b[0m API server  →  http://localhost:${PORT}`)
})
