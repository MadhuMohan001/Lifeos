import { useEffect, useState } from 'react'
import { loadAll, computeWeek, All } from '../weekly'
import { today, addDays } from '../app'
import { save } from '../db'
import { inp } from '../Crud'
const Q = ['What did I accomplish?', 'What did I fail to complete?', 'What distracted me?', 'What should I improve?', 'What are my priorities for next week?']
export default function Weekly() {
  const [d, setD] = useState<All | null>(null), [end, setEnd] = useState(today()), [ref, setRef] = useState<Record<string, string>>({})
  useEffect(() => { loadAll().then(setD) }, [])
  useEffect(() => { import('../db').then(m => m.list<any>('reflections')).then(a => setRef(a.find(r => r.id === end) ?? {})) }, [end])
  if (!d) return <p className="p-4">Loading…</p>
  const w = computeWeek(d, end), low = w.scores.filter(s => s.v < s.max * 0.5).map(s => s.k)
  const row = (a: string, b: string | number) => <div className="flex justify-between border-b py-1 text-sm"><span>{a}</span><b>{b}</b></div>
  return (<div className="p-4"><h1 className="text-xl font-bold">Weekly Assessment</h1>
    <label className="text-xs text-slate-500">Week ending<input type="date" className={inp} value={end} max={today()} onChange={e => setEnd(e.target.value)} /></label>
    <p className="text-xs text-slate-500">{addDays(end, -6)} to {end}</p>
    <div className="my-3 rounded-2xl bg-indigo-600 p-4 text-center text-white"><div className="text-4xl font-bold">{w.total}/100</div></div>
    <div className="mb-3 rounded-2xl bg-white p-3 shadow">{w.scores.map(s => row(s.k, `${s.v}/${s.max}`))}</div>
    <div className="mb-3 rounded-2xl bg-white p-3 shadow">{row('Tasks completed', w.done)}{row('Tasks missed/skipped', w.missed)}{row('Habit consistency', w.hp + '%')}{row('Study hours (planner)', w.hours)}{row('DSA problems', w.probs)}{row('Topics completed (total)', w.topics)}{row('Job applications', w.jobs)}{row('Mock interview avg', w.mockAvg ?? 'none')}{row('Workouts', w.workouts)}{row('Weight change', w.wDelta === null ? 'n/a' : w.wDelta + ' kg')}</div>
    <div className="mb-3 rounded-2xl bg-white p-3 text-sm shadow"><b>Needs improvement:</b> {low.length ? low.join(', ') : 'Nothing below 50% — keep going.'}</div>
    <p className="mb-3 text-xs text-slate-400">Scores come only from saved records. Targets/week: Java 10h, Backend 10h, DSA 7 problems + 5h, communication 3h + 2 practice/mock entries. Hours are read from Planner tasks whose title contains Java, Backend/Spring/JDBC, DSA, or Communication/Interview.</p>
    <h2 className="mb-2 font-semibold">Reflection</h2>
    {Q.map((q, i) => <label key={q} className="mb-2 block text-xs text-slate-500">{q}<textarea className={inp} defaultValue={ref['q' + i] ?? ''} key={end + i + (ref.id ?? '')} onBlur={async e => { const n = { ...ref, id: end, ['q' + i]: e.target.value }; setRef(n); await save('reflections', n) }} /></label>)}
  </div>)
}
