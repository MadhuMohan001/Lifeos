import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { save, remove, uid } from './db'
import { useStore, today } from './app'
export interface F { k: string; label: string; type?: 'text' | 'number' | 'date' | 'select' | 'textarea'; opts?: string[]; def?: any }
type Item = { id: string; [k: string]: any }
export const inp = 'w-full rounded-lg border border-slate-300 p-2 text-sm bg-white'
export default function Crud({ store, title, fields, head, sub, seed, empty }: { store: string; title: string; fields: F[]; head: (i: Item) => string; sub?: (i: Item) => string; seed?: { label: string; items: Record<string, any>[] }; empty?: string }) {
  const [items, load] = useStore<Item>(store)
  const [edit, setEdit] = useState<Item | null>(null)
  const blank = (): Item => { const o: Item = { id: uid() }; fields.forEach(f => o[f.k] = f.def ?? (f.type === 'date' ? today() : f.type === 'number' ? 0 : f.type === 'select' ? f.opts![0] : '')); return o }
  const sorted = [...items].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  return (
    <div>
      <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{title}</h2>
        <button aria-label={`Add ${title}`} onClick={() => setEdit(blank())} className="rounded-lg bg-indigo-600 p-2 text-white"><Plus size={18} /></button></div>
      {items.length === 0 && <div className="rounded-2xl bg-white p-5 text-center text-sm text-slate-500 shadow">{empty ?? 'Nothing here yet. Tap + to add.'}
        {seed && <div><button className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={async () => { for (const s of seed.items) await save(store, { ...blank(), ...s }); load() }}>{seed.label}</button></div>}</div>}
      {sorted.map(i => <div key={i.id} onClick={() => setEdit(i)} className="mb-2 rounded-2xl bg-white p-3 shadow"><b className="text-sm">{head(i)}</b>{sub && <div className="text-xs text-slate-500">{sub(i)}</div>}</div>)}
      {edit && <div className="fixed inset-0 z-20 flex items-end bg-black/40" onClick={() => setEdit(null)}>
        <div className="mx-auto max-h-[90vh] w-full max-w-md space-y-2 overflow-auto rounded-t-3xl bg-white p-4" onClick={e => e.stopPropagation()}>
          {fields.map(f => <label key={f.k} className="block text-xs text-slate-500">{f.label}
            {f.type === 'select' ? <select className={inp} value={edit[f.k]} onChange={e => setEdit({ ...edit, [f.k]: e.target.value })}>{f.opts!.map(o => <option key={o}>{o}</option>)}</select>
              : f.type === 'textarea' ? <textarea className={inp} value={edit[f.k]} onChange={e => setEdit({ ...edit, [f.k]: e.target.value })} />
                : <input className={inp} type={f.type ?? 'text'} step="any" value={edit[f.k]} onChange={e => setEdit({ ...edit, [f.k]: f.type === 'number' ? Number(e.target.value) : e.target.value })} />}</label>)}
          <div className="flex gap-2"><button className="flex-1 rounded-lg bg-indigo-600 p-2 text-white" onClick={async () => { await save(store, edit); setEdit(null); load() }}>Save</button>
            <button aria-label="Delete" className="rounded-lg bg-red-100 p-2 text-red-600" onClick={async () => { await remove(store, edit.id); setEdit(null); load() }}><Trash2 size={18} /></button></div>
        </div></div>}
    </div>)
}
