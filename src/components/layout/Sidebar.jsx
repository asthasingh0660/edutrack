import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, BarChart2,
  LogOut, X, Sun, Moon, RotateCcw
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const studentNav = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard' },
  { id: 'assignments', label: 'Assignments',  icon: BookOpen,        path: '/assignments' },
]

const adminNav = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard' },
  { id: 'assignments', label: 'Assignments',  icon: BookOpen,        path: '/assignments' },
  { id: 'analytics',   label: 'Analytics',    icon: BarChart2,       path: '/analytics' },
]

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { currentUser, role, darkMode, dispatch } = useApp()
  const navigate  = useNavigate()
  const location  = useLocation()
  const nav = role === 'admin' ? adminNav : studentNav

  function logout() {
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  function resetDemo() {
    dispatch({ type: 'RESET_DEMO' })
    navigate('/login')
  }

  const content = (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-6 pt-6 pb-5 border-b border-cream/10 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl text-cream">EduTrack</h1>
          <p className="font-mono text-[10px] text-cream/60 tracking-widest uppercase mt-0.5">
            {role === 'admin' ? 'Professor Portal' : 'Student Portal'}
          </p>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-cream/60 hover:text-cream transition-colors"
          aria-label="Close menu"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* User pill */}
      <div className="mx-4 mt-4 mb-2 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-cream/8 border border-cream/10">
        <div className="w-8 h-8 rounded-full bg-forest-mid flex items-center justify-center font-mono text-xs text-ink flex-shrink-0">
          {currentUser?.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs font-medium text-cream truncate">{currentUser?.name}</p>
          <p className="font-mono text-[10px] text-cream/60 truncate">{currentUser?.subject}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2 space-y-0.5">
        {nav.map(({ id, label, icon: Icon, path }) => {
          const active = location.pathname === path
          return (
            <button
              key={id}
              onClick={() => { navigate(path); setMobileOpen(false) }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                font-sans text-sm transition-all duration-150
                ${active
                  ? 'bg-cream/12 text-cream'
                  : 'text-cream/65 hover:text-cream hover:bg-cream/8'
                }
              `}
            >
              <Icon size={16} strokeWidth={1.5} className={active ? 'text-forest-mid' : ''} />
              {label}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto w-1 h-4 rounded-full bg-forest-mid"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-4 pb-6 space-y-0.5 border-t border-cream/10 pt-3">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/65 hover:text-cream hover:bg-cream/8 transition-all duration-150 font-sans text-sm"
        >
          {darkMode ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
          onClick={resetDemo}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/65 hover:text-cream hover:bg-cream/8 transition-all duration-150 font-sans text-sm"
        >
          <RotateCcw size={16} strokeWidth={1.5} />
          Reset Demo
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-coral/70 hover:text-coral hover:bg-coral-pale/10 transition-all duration-150 font-sans text-sm"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Log Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-[#1C1C14] border-r border-cream/5 h-screen sticky top-0 overflow-y-auto">
        {content}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-[#1C1C14] z-40 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 h-full w-64 bg-[#1C1C14] z-50 lg:hidden flex flex-col"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}