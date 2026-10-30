import { list } from './db'
import { addDays, lastN } from './app'
import { Task, plannedMin, completion } from './planner'
export const loadAll = async () => { const g = (s: string) => list<any>(s); const [tasks, habits, logs, topics, dsa, jobs, mocks, comm, weights, workouts, goals] = await Promise.all(['tasks', 'habits', 'habitlogs', 'topics', 'dsa', 'jobs', 'mocks', 'comm', 'weights', 'workouts', 'goals'].map(g)); return { tasks: tasks as Task[], habits, logs, topics, dsa, jobs, mocks, comm, weights, workouts, goals } }
export type All = Awaited<ReturnType<typeof loadAll>>
export const habitPct = (d: All, days: string[]) => { if (!d.habits.length) return 0; const done = d.logs.filter(l => l.done && days.includes(l.date) && d.habits.some(h => h.id === l.habitId)).length; return Math.round(100 * done / (d.habits.length * days.length)) }
const mins = (ts: Task[], re: RegExp) => ts.filter(t => re.test(t.title)).reduce((s, t) => s + (t.actualMin || (t.status === 'Completed' ? plannedMin(t) : 0)), 0)
export function computeWeek(d: All, end: string) {
  const days = lastN(end, 7), start = days[0], inW = (x?: string) => !!x && x >= start && x <= end
  const tasks = d.tasks.filter(t => inW(t.date)), hp = habitPct(d, days), tp = completion(tasks)
  const jm = mins(tasks, /java/i), bm = mins(tasks, /backend|spring|jdbc/i), dm = mins(tasks, /dsa/i), cm = mins(tasks, /communication|interview/i)
  const probs = d.dsa.filter(p => inW(p.date)).length, comms = d.comm.filter(c => inW(c.date)).length, mk = d.mocks.filter(m => inW(m.date))
  const c1 = (x: number) => Math.min(1, x)
  const scores = { 'Personal discipline': 15 * (hp + tp) / 200, 'Core Java': 25 * c1(jm / 600), 'DSA': 20 * c1(0.5 * c1(probs / 7) + 0.5 * c1(dm / 300)), 'Backend development': 25 * c1(bm / 600), 'Communication & interviews': 15 * c1(0.5 * c1(cm / 180) + 0.5 * c1((comms + mk.length) / 2)) }
  const max = [15, 25, 20, 25, 15], vals = Object.values(scores), r = vals.map(Math.round)
  const w = d.weights.filter(x => x.date <= end).sort((a, b) => a.date.localeCompare(b.date)), wp = d.weights.filter(x => x.date < start).sort((a, b) => a.date.localeCompare(b.date))
  return { days, scores: Object.keys(scores).map((k, i) => ({ k, v: r[i], max: max[i] })), total: r.reduce((a, b) => a + b, 0),
    done: tasks.filter(t => t.status === 'Completed').length, missed: tasks.filter(t => t.status === 'Skipped' || (t.status === 'Pending' && t.date < addDays(end, 1) && t.date <= end && t.date < end)).length,
    hp, tp, hours: +((jm + bm + dm + cm) / 60).toFixed(1), probs, topics: d.topics.filter(t => t.status === 'Completed').length, jobs: d.jobs.filter(j => inW(j.date)).length,
    mockAvg: mk.length ? +(mk.reduce((s, m) => s + m.score, 0) / mk.length).toFixed(1) : null, workouts: d.workouts.filter(x => inW(x.date)).length,
    wDelta: w.length && wp.length ? +(w[w.length - 1].kg - wp[wp.length - 1].kg).toFixed(1) : null }
}
