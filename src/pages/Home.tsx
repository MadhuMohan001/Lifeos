import { useEffect, useState } from 'react'
import { Task, today, completion } from '../planner'
import { loadAll, computeWeek, habitPct, All } from '../weekly'
import { useSettings, daysBetween } from '../app'
export default function Home() {
  const [d, setD] = useState<All | null>(null), [s, up] = useSettings()
  useEffect(() => { loadAll().then(setD) }, [])
  if (!d) return <p className="p-4">Loading…</p>
  const tt = d.tasks.filter((t: Task) => t.date === today()), top = tt.filter(t => t.priority === 'High' && t.status !== 'Completed').slice(0, 5), w = computeWeek(d, today())
  const day = s.challengeStart ? Math.min(30, daysBetween(s.challengeStart, today()) + 1) : 0, hrs = d.topics.reduce((a, t) => a + (t.hours || 0), 0)
  const card = (l: string, v: string | number) => <div className="rounded-2xl bg-white p-3 shadow"><div className="text-xs text-slate-500">{l}</div><div className="text-lg font-bold">{v}</div></div>
  return (<div className="p-4"><h1 className="text-xl font-bold">LifeOS</h1>
    <p className="text-slate-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
    <div className="my-3 rounded-2xl bg-indigo-600 p-4 text-white">{s.challengeStart ? <b>30-day challenge: Day {day}/30</b> : <button onClick={() => up({ challengeStart: today() })}>Start the 30-day challenge</button>}</div>
    <div className="grid grid-cols-2 gap-2">{card('Tasks today', completion(tt) + '%')}{card('Habits today', habitPct(d, [today()]) + '%')}{card('Active goals', d.goals.filter(g => g.status === 'Active').length)}
      {card('Topics done', `${d.topics.filter(t => t.status === 'Completed').length}/${d.topics.length}`)}{card('Study hours (topics)', hrs)}{card('DSA solved', d.dsa.length)}{card('Applications', d.jobs.length)}
      {card('Weight', `${s.currentWeight} → ${s.targetWeight} kg`)}{card('Workout today', d.workouts.some(x => x.date === today()) ? 'Done ✓' : 'Not yet')}{card('Weekly score', w.total + '/100')}</div>
    <h2 className="mb-2 mt-4 font-semibold">Today's priorities</h2>
    {top.length === 0 ? <p className="text-sm text-slate-500">No open high-priority tasks. Add some in Planner.</p> : top.map(t => <div key={t.id} className="mb-2 rounded-xl bg-white p-3 text-sm shadow">{t.start} · {t.title}</div>)}</div>)
}
