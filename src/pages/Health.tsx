import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import Crud, { inp } from '../Crud'
import { useSettings, useStore, today, lastN } from '../app'
const D = { k: 'date', label: 'Date', type: 'date' as const }
function Weight() {
  const [s, up] = useSettings(), [ws] = useStore<any>('weights'), sorted = [...ws].sort((a, b) => a.date.localeCompare(b.date)), cur = sorted.length ? sorted[sorted.length - 1].kg : s.currentWeight
  useEffect(() => { if (sorted.length && s.currentWeight !== cur) up({ currentWeight: cur }) }, [cur])
  const n = (k: keyof typeof s, l: string) => <label className="text-xs text-slate-500">{l}<input type="number" step="any" className={inp} value={s[k] as number} onChange={e => up({ [k]: Number(e.target.value) })} /></label>
  return (<div><div className="mb-3 grid grid-cols-2 gap-2 rounded-2xl bg-white p-3 shadow">{n('startWeight', 'Start (kg)')}{n('targetWeight', 'Target (kg)')}{n('height', 'Height (cm)')}
    <div className="text-sm">Current <b>{cur} kg</b><br />Gained <b>{+(cur - s.startWeight).toFixed(1)} kg</b></div></div>
    {sorted.length > 1 && <div className="mb-3 h-36 rounded-2xl bg-white p-2 shadow"><ResponsiveContainer><LineChart data={sorted}><XAxis dataKey="date" fontSize={9} /><YAxis domain={['dataMin-1', 'dataMax+1']} fontSize={10} width={30} /><Line dataKey="kg" stroke="#4f46e5" /></LineChart></ResponsiveContainer></div>}
    <Crud store="weights" title="Weight entries" head={w => `${w.kg} kg`} sub={w => w.date} fields={[D, { k: 'kg', label: 'Weight (kg)', type: 'number' }]} /></div>)
}
function Summary() {
  const [w] = useStore<any>('workouts'), [sl] = useStore<any>('sleep'), [wa] = useStore<any>('water'), [f] = useStore<any>('food'), days = lastN(today(), 7), inW = (x: any) => days.includes(x.date)
  const avg = (a: any[], k: string) => a.length ? +(a.reduce((s, x) => s + x[k], 0) / a.length).toFixed(1) : 0, tf = f.filter((x: any) => x.date === today())
  return (<div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow"><b>Last 7 days</b><p>Workouts: {w.filter(inW).length} · {w.filter(inW).reduce((s: number, x: any) => s + x.minutes, 0)} min</p>
    <p>Avg sleep: {avg(sl.filter(inW), 'hours')} h · Avg water: {avg(wa.filter(inW), 'ml')} ml/entry</p>
    <p>Today's food: {tf.reduce((s: number, x: any) => s + x.calories, 0)} kcal · {tf.reduce((s: number, x: any) => s + x.protein, 0)} g protein</p>
    <p className="text-xs text-slate-400">General tracking only, not medical advice. Aim for gradual, sustainable gain and consult a doctor or dietitian for personal guidance.</p></div>)
}
const TABS: Record<string, JSX.Element> = {
  Weight: <Weight />,
  Food: <Crud store="food" title="Food log" head={f => `${f.meal}: ${f.name}`} sub={f => `${f.date} · ${f.quantity} · ${f.calories} kcal · ${f.protein} g protein`} fields={[D, { k: 'meal', label: 'Meal', type: 'select', opts: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] }, { k: 'name', label: 'Food' }, { k: 'quantity', label: 'Quantity' }, { k: 'calories', label: 'Est. calories', type: 'number' }, { k: 'protein', label: 'Est. protein (g)', type: 'number' }]} />,
  Workout: <Crud store="workouts" title="Workouts" head={w => `${w.exercise} (${w.group})`} sub={w => `${w.date} · ${w.sets}×${w.reps} · ${w.minutes} min`} fields={[D, { k: 'exercise', label: 'Exercise' }, { k: 'group', label: 'Muscle group', type: 'select', opts: ['Chest', 'Shoulders', 'Back', 'Legs', 'Arms', 'Full body'] }, { k: 'sets', label: 'Sets', type: 'number' }, { k: 'reps', label: 'Reps', type: 'number' }, { k: 'minutes', label: 'Duration (min)', type: 'number' }]} />,
  Water: <Crud store="water" title="Water intake" head={w => `${w.ml} ml`} sub={w => w.date} fields={[D, { k: 'ml', label: 'Amount (ml)', type: 'number', def: 250 }]} />,
  Sleep: <Crud store="sleep" title="Sleep" head={s => `${s.hours} h`} sub={s => `${s.date} · ${s.notes}`} fields={[D, { k: 'hours', label: 'Hours slept', type: 'number', def: 7 }, { k: 'notes', label: 'Notes' }]} />,
  Body: <Crud store="body" title="Body measurements" head={b => b.date} sub={b => `chest ${b.chest} · waist ${b.waist} · arms ${b.arms} · thighs ${b.thighs} (cm)`} fields={[D, ...['chest', 'waist', 'arms', 'thighs'].map(k => ({ k, label: k + ' (cm)', type: 'number' as const }))]} />,
  Activity: <Crud store="activity" title="Daily activity" head={a => a.activity} sub={a => `${a.date} · ${a.minutes} min`} fields={[D, { k: 'activity', label: 'Activity', def: 'Walking' }, { k: 'minutes', label: 'Minutes', type: 'number' }]} />,
  Summary: <Summary />,
}
export default function Health() {
  const [t, setT] = useState('Weight')
  return (<div className="p-4"><h1 className="mb-2 text-xl font-bold">Health & Fitness</h1>
    <div className="mb-3 flex gap-2 overflow-x-auto">{Object.keys(TABS).map(k => <button key={k} onClick={() => setT(k)} className={`whitespace-nowrap rounded-full px-3 py-1 text-sm ${t === k ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>{k}</button>)}</div>
    <div key={t}>{TABS[t]}</div></div>)
}
