import { Capacitor } from '@capacitor/core'
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'

// Document-style tables: one row per record, JSON payload. Migrations by version.
const MIGRATIONS = [`CREATE TABLE IF NOT EXISTS docs(store TEXT NOT NULL, id TEXT NOT NULL, json TEXT NOT NULL, PRIMARY KEY(store,id));`]
let conn: SQLiteDBConnection | null = null
const native = Capacitor.isNativePlatform()

async function open() {
  if (conn) return conn
  const sqlite = new SQLiteConnection(CapacitorSQLite)
  conn = await sqlite.createConnection('lifeos', false, 'no-encryption', 1, false)
  await conn.open()
  for (const m of MIGRATIONS) await conn.execute(m)
  return conn
}

// Browser preview fallback only; Android always uses SQLite.
const ls = (s: string) => `lifeos:${s}`
export async function list<T extends { id: string }>(store: string): Promise<T[]> {
  if (!native) return JSON.parse(localStorage.getItem(ls(store)) || '[]')
  const c = await open()
  const r = await c.query('SELECT json FROM docs WHERE store=?', [store])
  return (r.values ?? []).map(v => JSON.parse(v.json))
}
export async function save<T extends { id: string }>(store: string, item: T) {
  if (!native) {
    const all = await list<T>(store), i = all.findIndex(x => x.id === item.id)
    i >= 0 ? (all[i] = item) : all.push(item)
    return localStorage.setItem(ls(store), JSON.stringify(all))
  }
  const c = await open()
  await c.run('INSERT OR REPLACE INTO docs(store,id,json) VALUES(?,?,?)', [store, item.id, JSON.stringify(item)])
}
export async function remove(store: string, id: string) {
  if (!native) return localStorage.setItem(ls(store), JSON.stringify((await list<{ id: string }>(store)).filter(x => x.id !== id)))
  await (await open()).run('DELETE FROM docs WHERE store=? AND id=?', [store, id])
}
export const uid = () => crypto.randomUUID()

export const STORES = ['tasks','habits','habitlogs','goals','topics','dsa','projects','questions','mocks','comm','jobs','weights','food','workouts','water','sleep','body','activity','settings','reflections']
export async function dump() { const o: Record<string, any[]> = {}; for (const s of STORES) o[s] = await list<any>(s); return o }
export async function clearAll() {
  if (!native) STORES.forEach(s => localStorage.removeItem(ls(s)))
  else await (await open()).run('DELETE FROM docs', [])
}
export async function restore(o: Record<string, any[]>) { await clearAll(); for (const s of STORES) for (const it of o[s] ?? []) await save(s, it) }
export async function exportFile(name: string, text: string, mime: string) {
  if (native) {
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')
    const { Share } = await import('@capacitor/share')
    const r = await Filesystem.writeFile({ path: name, data: text, directory: Directory.Cache, encoding: Encoding.UTF8 })
    await Share.share({ title: name, url: r.uri })
  } else { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime })); a.download = name; a.click() }
}
