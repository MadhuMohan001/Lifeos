import Crud from '../Crud'
import { useSettings, today, daysBetween } from '../app'
export default function Goals() {
  const [s, up] = useSettings(); const day = s.challengeStart ? Math.min(30, daysBetween(s.challengeStart, today()) + 1) : 0
  return (
    <div className="p-4"><h1 className="mb-3 text-xl font-bold">Goals</h1>
      <div className="mb-4 rounded-2xl bg-indigo-600 p-4 text-white"><div className="text-sm">30-Day Discipline Challenge</div>
        {s.challengeStart ? <><div className="text-2xl font-bold">Day {day} / 30</div><div className="mt-2 h-2 rounded bg-white/30"><div className="h-2 rounded bg-white" style={{ width: `${day / 30 * 100}%` }} /></div>
          <button className="mt-2 text-xs underline" onClick={() => confirm('Restart the challenge from today?') && up({ challengeStart: today() })}>Restart</button></>
          : <button className="mt-2 rounded-lg bg-white px-4 py-2 text-indigo-700" onClick={() => up({ challengeStart: today() })}>Start today</button>}</div>
      <Crud store="goals" title="My goals" head={g => g.title || '(untitled)'} empty="No goals yet. Add your first goal."
        sub={g => `${g.period} · ${g.category} · ${g.status} · ${g.progress}% · ${g.target ? (daysBetween(today(), g.target) >= 0 ? `due in ${daysBetween(today(), g.target)}d` : 'overdue') : 'no deadline'}`}
        fields={[{ k: 'title', label: 'Title' }, { k: 'description', label: 'Description', type: 'textarea' }, { k: 'category', label: 'Category', type: 'select', opts: ['Personal development', 'Career', 'Education', 'Health and fitness', 'Lifestyle'] },
          { k: 'period', label: 'Period', type: 'select', opts: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'] }, { k: 'priority', label: 'Priority', type: 'select', opts: ['High', 'Medium', 'Low'] },
          { k: 'status', label: 'Status', type: 'select', opts: ['Active', 'Completed', 'Paused'] }, { k: 'start', label: 'Start date', type: 'date' }, { k: 'target', label: 'Target date', type: 'date', def: '' },
          { k: 'progress', label: 'Progress %', type: 'number' }, { k: 'milestones', label: 'Milestones (one per line)', type: 'textarea' }, { k: 'review', label: 'Review notes', type: 'textarea' }]} />
    </div>)
}
