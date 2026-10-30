import { useEffect, useState } from 'react'
import { Plus, Trash2, ArrowRightCircle } from 'lucide-react'
import { list, save, remove, uid } from '../db'
import { Task, Status, Priority, today, completion, plannedMin, DEFAULTS } from '../planner'

const STATUSES: Status[] = ['Pending', 'In Progress', 'Completed', 'Skipped']
const blank = (): Task => ({ id: uid(), date: today(), title: '', start: '09:00', end: '10:00', priority: 'Medium', status: 'Pending', remarks: '', outcome: '', actualMin: 0 })

export default function Planner() {
  const [date, setDate] = useState(today())
  const [all, setAll] = useState<Task[]>([])
  const [edit, setEdit] = useState<Task | null>(null)
  const [err, setErr] = useState('')
  const load = () => list<Task>('tasks').then(setAll).catch(e => setErr(String(e)))
  useEffect(() => { load() }, [])
  const tasks = all.filter(t => t.date === date).sort((a, b) => a.start.localeCompare(b.start))
  const upd = async (t: Task) => { await save('tasks', t); load() }
  const seed = async () => { for (const [title, start, end, priority] of DEFAULTS) await save('tasks', { ...blank(), date, title, start, end, priority }); load() }
  const carry = async () => { // move unfinished tasks from earlier days to this date
    for (const t of all.filter(t => t.date < date && (t.status === 'Pending' || t.status === 'In Progress'))) await save('tasks', { ...t, date }); load() }
  const inp = 'w-full rounded-lg border p-2 text-sm'
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Daily Planner</h1>
      <div className="my-3 flex items-center gap-2">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inp} />
        <button onClick={carry} title="Carry unfinished forward" className="rounded-lg bg-slate-200 p-2"><ArrowRightCircle size={20} /></button>
        <button onClick={() => setEdit({ ...blank(), date })} className="rounded-lg bg-indigo-600 p-2 text-white"><Plus size={20} /></button>
      </div>
      <div className="mb-3 rounded-2xl bg-white p-3 shadow">
        <div className="text-sm text-slate-500">Completion</div>
        <div className="h-2 overflow-hidden rounded bg-slate-200"><div className="h-2 bg-indigo-600" style={{ width: `${completion(tasks)}%` }} /></div>
        <div className="mt-1 text-right text-sm font-semibold">{completion(tasks)}%</div>
      </div>
      {err && <p className="text-red-600">Database error: {err}</p>}
      {tasks.length === 0 && <div className="rounded-2xl bg-white p-6 text-center shadow"><p className="mb-3 text-slate-500">No tasks for this day.</p><button onClick={seed} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Load default timetable</button></div>}
      {tasks.map(t => (
        <div key={t.id} className="mb-2 rounded-2xl bg-white p-3 shadow" onClick={() => setEdit(t)}>
          <div className="flex justify-between"><b className={t.status === 'Completed' ? 'line-through text-slate-400' : ''}>{t.title}</b><span className="text-xs">{t.priority}</span></div>
          <div className="text-xs text-slate-500">{t.start}–{t.end} · planned {plannedMin(t)}m · actual {t.actualMin}m</div>
          <select value={t.status} onClick={e => e.stopPropagation()} onChange={e => upd({ ...t, status: e.target.value as Status })} className="mt-2 rounded border p-1 text-xs">{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
        </div>))}
      {edit && (
        <div className="fixed inset-0 z-10 flex items-end bg-black/40" onClick={() => setEdit(null)}>
          <div className="mx-auto max-h-[90vh] w-full max-w-md space-y-2 overflow-auto rounded-t-3xl bg-white p-4" onClick={e => e.stopPropagation()}>
            <input className={inp} placeholder="Title" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} />
            <div className="flex gap-2"><input type="time" className={inp} value={edit.start} onChange={e => setEdit({ ...edit, start: e.target.value })} /><input type="time" className={inp} value={edit.end} onChange={e => setEdit({ ...edit, end: e.target.value })} /></div>
            <div className="flex gap-2">
              <select className={inp} value={edit.priority} onChange={e => setEdit({ ...edit, priority: e.target.value as Priority })}>{['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}</select>
              <input type="number" min={0} className={inp} placeholder="Actual min" value={edit.actualMin} onChange={e => setEdit({ ...edit, actualMin: +e.target.value })} />
            </div>
            <textarea className={inp} placeholder="Remarks" value={edit.remarks} onChange={e => setEdit({ ...edit, remarks: e.target.value })} />
            <textarea className={inp} placeholder="Learning outcome" value={edit.outcome} onChange={e => setEdit({ ...edit, outcome: e.target.value })} />
            <div className="flex gap-2">
              <button disabled={!edit.title.trim()} onClick={async () => { await upd(edit); setEdit(null) }} className="flex-1 rounded-lg bg-indigo-600 p-2 text-white disabled:opacity-40">Save</button>
              <button onClick={async () => { await remove('tasks', edit.id); setEdit(null); load() }} className="rounded-lg bg-red-100 p-2 text-red-600"><Trash2 size={20} /></button>
            </div>
          </div>
        </div>)}
    </div>)
}
