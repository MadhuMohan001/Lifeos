import { useState } from 'react'
import { dump, restore, clearAll, exportFile, STORES } from '../db'
export default function Settings() {
  const [msg, setMsg] = useState(''), [dark, setDark] = useState(document.documentElement.classList.contains('dark'))
  const csv = async () => { const d = await dump(); let out = ''; for (const s of STORES) { const r = d[s]; if (!r.length) continue; const h = [...new Set(r.flatMap(x => Object.keys(x)))]; out += `# ${s}\n${h.join(',')}\n` + r.map(x => h.map(k => `"${String(x[k] ?? '').replace(/"/g, '""')}"`).join(',')).join('\n') + '\n\n' } await exportFile('lifeos-export.csv', out || 'No data', 'text/csv') }
  const btn = 'mb-2 w-full rounded-xl bg-white p-3 text-left shadow'
  return (<div className="p-4"><h1 className="mb-3 text-xl font-bold">Settings</h1>
    <button className={btn} onClick={() => { const n = !dark; setDark(n); document.documentElement.classList.toggle('dark', n); localStorage.setItem('lifeos:dark', n ? '1' : '') }}>Dark mode: {dark ? 'On' : 'Off'}</button>
    <button className={btn} onClick={async () => { await exportFile('lifeos-backup.json', JSON.stringify(await dump()), 'application/json'); setMsg('Backup created.') }}>Backup data (JSON)</button>
    <label className={btn + ' block'}>Restore from JSON backup (replaces current data)<input type="file" accept=".json,application/json" className="mt-2 block text-xs" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; try { const o = JSON.parse(await f.text()); if (typeof o !== 'object' || !o) throw 0; if (confirm('Replace all current data?')) { await restore(o); setMsg('Restored. Reloading…'); setTimeout(() => location.reload(), 600) } } catch { setMsg('Invalid backup file.') } }} /></label>
    <button className={btn} onClick={csv}>Export all data (CSV)</button>
    <button className={btn + ' text-red-600'} onClick={async () => { if (confirm('Delete ALL data permanently?')) { await clearAll(); localStorage.removeItem('lifeos:habitsSeeded'); setMsg('All data deleted.') } }}>Delete all data</button>
    {msg && <p className="text-sm text-indigo-600">{msg}</p>}<p className="mt-4 text-xs text-slate-400">LifeOS 1.0.0 · all data stays on this device.</p></div>)
}
