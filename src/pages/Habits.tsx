import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { save, remove, uid } from '../db'
import { useStore, today, lastN, addDays } from '../app'
import { inp } from '../Crud'
interface H { id: string; name: string } interface L { id: string; habitId: string; date: string; done: boolean; note: string }
const DEFAULT = ['Wake up at 5:30 AM', 'Read Atomic Habits for one hour', 'Attend class', 'Practise Java', 'Solve DSA problems', 'Learn backend development', 'Practise communication', 'Exercise', 'Reduce unnecessary phone usage', 'Sleep at 10 PM']
export default function Habits() {
  const [hs, loadH] = useStore<H>('habits'), [ls, loadL] = useStore<L>('habitlogs'), [name, setName] = useState('')
  useEffect(() => { if (hs.length === 0 && !localStorage.getItem('lifeos:habitsSeeded')) { localStorage.setItem('lifeos:habitsSeeded', '1'); Promise.all(DEFAULT.map(n => save('habits', { id: uid(), name: n }))).then(loadH) } }, [hs.length])
  const log = (h: string, d: string) => ls.find(l => l.id === `${h}_${d}`)
  const setLog = async (h: string, d: string, p: Partial<L>) => { await save('habitlogs', { id: `${h}_${d}`, habitId: h, date: d, done: false, note: '', ...log(h, d), ...p }); loadL() }
  const streak = (h: string) => { let d = today(), n = 0; if (!log(h, d)?.done) d = addDays(d, -1); while (log(h, d)?.done) { n++; d = addDays(d, -1) } return n }
  const pct = (h: string) => Math.round(100 * lastN(today(), 30).filter(d => log(h, d)?.done).length / 30)
  const week = lastN(today(), 7).map(d => ({ d: d.slice(5), p: hs.length ? Math.round(100 * hs.filter(h => log(h.id, d)?.done).length / hs.length) : 0 }))
  const doneToday = hs.filter(h => log(h.id, today())?.done).length
  return (
    <div className="p-4"><h1 className="text-xl font-bold">Habits</h1>
      <p className="text-sm text-slate-500">Today: {doneToday}/{hs.length} done</p>
      <div className="my-3 h-32 rounded-2xl bg-white p-2 shadow"><ResponsiveContainer><BarChart data={week}><XAxis dataKey="d" fontSize={10} /><YAxis domain={[0, 100]} fontSize={10} width={28} /><Bar dataKey="p" fill="#4f46e5" radius={4} /></BarChart></ResponsiveContainer></div>
      {hs.map(h => { const l = log(h.id, today()); return (
        <div key={h.id} className="mb-2 rounded-2xl bg-white p-3 shadow">
          <div className="flex items-center gap-3"><input type="checkbox" className="h-5 w-5" checked={!!l?.done} onChange={e => setLog(h.id, today(), { done: e.target.checked })} />
            <div className="flex-1 text-sm"><b>{h.name}</b><div className="text-xs text-slate-500">🔥 {streak(h.id)}-day streak · 30-day {pct(h.id)}%</div></div>
            <button aria-label="Delete habit" onClick={async () => { await remove('habits', h.id); loadH() }} className="text-slate-400"><Trash2 size={16} /></button></div>
          <div className="mt-2 flex gap-1">{lastN(today(), 14).map(d => <span key={d} title={d} className={`h-3 flex-1 rounded ${log(h.id, d)?.done ? 'bg-green-500' : 'bg-slate-200'}`} />)}</div>
          <input key={l?.note} className={inp + ' mt-2'} placeholder="Note for today" defaultValue={l?.note ?? ''} onBlur={e => e.target.value !== (l?.note ?? '') && setLog(h.id, today(), { note: e.target.value })} />
        </div>) })}
      <div className="flex gap-2"><input className={inp} placeholder="New custom habit" value={name} onChange={e => setName(e.target.value)} />
        <button aria-label="Add habit" disabled={!name.trim()} onClick={async () => { await save('habits', { id: uid(), name: name.trim() }); setName(''); loadH() }} className="rounded-lg bg-indigo-600 p-2 text-white disabled:opacity-40"><Plus size={18} /></button></div>
      <p className="mt-3 text-xs text-slate-400">Missed days are never deleted; the last 14 days show above as history.</p>
    </div>)
}
