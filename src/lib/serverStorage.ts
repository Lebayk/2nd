/**
 * Adapteur de storage Zustand qui persiste côté serveur (data/state.json).
 * Fallback automatique sur localStorage si le serveur est injoignable.
 *
 * Stratégie :
 *  - getItem  → serveur en priorité, localStorage en repli
 *  - setItem  → localStorage immédiatement + sync serveur en arrière-plan
 *  - removeItem → les deux
 */

const LOCAL_KEY = 'maths-premiere-v2'
const API = '/api/state'
const TIMEOUT_MS = 2500

function timeout(ms: number) {
  return AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined
}

export const serverStorage = {
  getItem: async (_key: string): Promise<string | null> => {
    try {
      const res = await fetch(API, { signal: timeout(TIMEOUT_MS) })
      if (!res.ok) throw new Error('server error')
      const text = await res.text()
      if (!text || text === 'null') return null
      // On met à jour localStorage pour que le repli soit frais
      localStorage.setItem(LOCAL_KEY, text)
      return text
    } catch {
      return localStorage.getItem(LOCAL_KEY)
    }
  },

  setItem: async (_key: string, value: string): Promise<void> => {
    localStorage.setItem(LOCAL_KEY, value)
    // Sync serveur sans bloquer le rendu
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: value,
      signal: timeout(TIMEOUT_MS),
    }).catch(() => { /* offline – la copie locale suffit */ })
  },

  removeItem: async (_key: string): Promise<void> => {
    localStorage.removeItem(LOCAL_KEY)
    fetch(API, { method: 'DELETE', signal: timeout(TIMEOUT_MS) }).catch(() => {})
  },
}
