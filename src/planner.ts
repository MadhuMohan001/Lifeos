export type Status = 'Pending' | 'In Progress' | 'Completed' | 'Skipped'
export type Priority = 'High' | 'Medium' | 'Low'
export interface Task { id: string; date: string; title: string; start: string; end: string; priority: Priority; status: Status; remarks: string; outcome: string; actualMin: number }
export const today = () => new Date().toLocaleDateString('en-CA')
const mins = (a: string, b: string) => { const [h1, m1] = a.split(':').map(Number), [h2, m2] = b.split(':').map(Number); return h2 * 60 + m2 - (h1 * 60 + m1) }
export const plannedMin = (t: Task) => Math.max(0, mins(t.start, t.end))
export const completion = (ts: Task[]) => { const c = ts.filter(t => t.status !== 'Skipped'); return c.length ? Math.round(100 * c.filter(t => t.status === 'Completed').length / c.length) : 0 }
export const DEFAULTS: [string, string, string, Priority][] = [
  ['Atomic Habits reading', '05:30', '06:30', 'High'], ['Breakfast and preparation', '06:30', '08:00', 'Low'], ['Class', '08:00', '09:30', 'High'],
  ['Core Java', '10:00', '12:00', 'High'], ['DSA', '12:00', '13:00', 'High'], ['Lunch and rest', '13:00', '14:00', 'Low'],
  ['Backend development', '14:00', '16:00', 'High'], ['Break', '16:00', '16:30', 'Low'], ['Communication practice', '16:30', '17:15', 'Medium'],
  ['Job preparation', '17:15', '18:00', 'High'], ['Exercise, dinner and personal time', '18:00', '20:00', 'Medium'],
  ['Revision and planning', '20:00', '20:30', 'Medium'], ['Wind down and sleep', '21:30', '22:00', 'Low']]
