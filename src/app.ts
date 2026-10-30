import { useEffect, useState } from 'react'
import { list, save } from './db'
import { today } from './planner'
export { today }
export const addDays = (d: string, n: number) => { const x = new Date(d + 'T00:00:00'); x.setDate(x.getDate() + n); return x.toLocaleDateString('en-CA') }
export const lastN = (end: string, n: number) => Array.from({ length: n }, (_, i) => addDays(end, i - n + 1))
export const daysBetween = (a: string, b: string) => Math.round((+new Date(b + 'T00:00:00') - +new Date(a + 'T00:00:00')) / 864e5)
export function useStore<T extends { id: string }>(store: string): [T[], () => void] {
  const [a, setA] = useState<T[]>([]); const load = () => { list<T>(store).then(setA).catch(() => setA([])) }
  useEffect(() => { load() }, []); return [a, load]
}
export interface Settings { id: string; challengeStart: string; height: number; startWeight: number; targetWeight: number; currentWeight: number }
const DEF = (): Settings => ({ id: 'main', challengeStart: '', height: 0, startWeight: 49, targetWeight: 60, currentWeight: 55 })
export function useSettings() {
  const [s, setS] = useState<Settings>(DEF())
  useEffect(() => { list<Settings>('settings').then(a => a[0] && setS({ ...DEF(), ...a[0] })) }, [])
  const update = async (p: Partial<Settings>) => { const n = { ...s, ...p }; setS(n); await save('settings', n) }
  return [s, update] as const
}
