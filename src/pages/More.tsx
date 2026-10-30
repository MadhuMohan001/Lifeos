import { Link } from 'react-router-dom'
import { GraduationCap, HeartPulse, BarChart3, Settings } from 'lucide-react'
export default function More() {
  const L = [['/learning', 'Learning & Career', GraduationCap], ['/health', 'Health & Fitness', HeartPulse], ['/weekly', 'Weekly Assessment', BarChart3], ['/settings', 'Settings', Settings]] as const
  return <div className="p-4"><h1 className="mb-3 text-xl font-bold">More</h1>{L.map(([to, l, I]) => <Link key={to} to={to} className="mb-2 flex items-center gap-3 rounded-2xl bg-white p-4 shadow"><I size={22} className="text-indigo-600" />{l}</Link>)}</div>
}
