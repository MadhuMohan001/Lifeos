import { NavLink, Route, Routes } from 'react-router-dom'
import { Home as HomeI, CalendarCheck, Repeat, Target, Menu } from 'lucide-react'
import Home from './pages/Home'; import Planner from './pages/Planner'; import Habits from './pages/Habits'; import Goals from './pages/Goals'
import More from './pages/More'; import Learning from './pages/Learning'; import Health from './pages/Health'; import Weekly from './pages/Weekly'; import Settings from './pages/Settings'
if (localStorage.getItem('lifeos:dark')) document.documentElement.classList.add('dark')
export default function App() {
  const tab = ({ isActive }: { isActive: boolean }) => `flex flex-1 flex-col items-center py-2 text-xs ${isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500'}`
  return (<div className="mx-auto min-h-screen max-w-md pb-20" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
    <Routes><Route path="/" element={<Home />} /><Route path="/planner" element={<Planner />} /><Route path="/habits" element={<Habits />} /><Route path="/goals" element={<Goals />} />
      <Route path="/more" element={<More />} /><Route path="/learning" element={<Learning />} /><Route path="/health" element={<Health />} /><Route path="/weekly" element={<Weekly />} /><Route path="/settings" element={<Settings />} /></Routes>
    <nav className="nav fixed inset-x-0 bottom-0 mx-auto flex max-w-md border-t bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <NavLink to="/" end className={tab}><HomeI size={22} />Home</NavLink><NavLink to="/planner" className={tab}><CalendarCheck size={22} />Planner</NavLink>
      <NavLink to="/habits" className={tab}><Repeat size={22} />Habits</NavLink><NavLink to="/goals" className={tab}><Target size={22} />Goals</NavLink><NavLink to="/more" className={tab}><Menu size={22} />More</NavLink></nav></div>)
}
