import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { students, professors } from '../data/students'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function Login() {
  const { dispatch } = useApp()
  const navigate = useNavigate()
  const [step, setStep]       = useState('role')   // 'role' | 'pick'
  const [role, setRole]       = useState(null)      // 'student' | 'admin'
  const [selected, setSelected] = useState(null)

  const people = role === 'student' ? students : professors

  function chooseRole(r) {
    setRole(r)
    setStep('pick')
    setSelected(null)
  }

  function login() {
    if (!selected) return
    dispatch({ type: 'LOGIN', payload: { user: selected, role } })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="font-serif text-5xl text-ink mb-1">EduTrack</h1>
        <p className="font-mono text-xs tracking-widest uppercase text-ink/30">
          Assignment Management System
        </p>
      </motion.div>

      {/* Step: choose role */}
      {step === 'role' && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg"
        >
          <RoleCard
            variants={item}
            icon={<GraduationCap size={28} strokeWidth={1.5} />}
            title="I'm a Student"
            description="View assignments, track progress, confirm submissions."
            accent="forest"
            onClick={() => chooseRole('student')}
          />
          <RoleCard
            variants={item}
            icon={<BookOpen size={28} strokeWidth={1.5} />}
            title="I'm a Professor"
            description="Create assignments, monitor submissions, view analytics."
            accent="gold"
            onClick={() => chooseRole('admin')}
          />
        </motion.div>
      )}

      {/* Step: pick user */}
      {step === 'pick' && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          <motion.button
            variants={item}
            onClick={() => setStep('role')}
            className="font-mono text-xs text-ink/40 uppercase tracking-widest mb-6 hover:text-ink/70 transition-colors flex items-center gap-1"
          >
            ← Back
          </motion.button>

          <motion.p variants={item} className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-3">
            {role === 'student' ? 'Select your account' : 'Select professor account'}
          </motion.p>

          <motion.div variants={item} className="space-y-2 mb-6">
            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => setSelected(person)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 text-left
                  ${selected?.id === person.id
                    ? 'border-forest bg-forest-pale'
                    : 'border-cream-border bg-cream hover:border-forest-mid hover:bg-forest-pale/50'
                  }
                `}
              >
                {/* Avatar */}
                <div className={`
                  w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                  font-mono text-xs font-medium
                  ${selected?.id === person.id
                    ? 'bg-forest text-cream'
                    : 'bg-cream-dark text-ink/60'
                  }
                `}>
                  {person.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium text-sm text-ink truncate">{person.name}</p>
                  <p className="font-mono text-xs text-ink/40 truncate">{person.email}</p>
                </div>

                {/* Subject badge */}
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-cream-dark text-ink/50 border border-cream-border flex-shrink-0">
                  {person.subject}
                </span>
              </button>
            ))}
          </motion.div>

          <motion.button
            variants={item}
            onClick={login}
            disabled={!selected}
            className={`
              w-full flex items-center justify-center gap-2 py-3 rounded-pill
              font-sans font-medium text-sm transition-all duration-200
              ${selected
                ? 'bg-ink text-cream hover:bg-ink/80 cursor-pointer'
                : 'bg-cream-dark text-ink/30 cursor-not-allowed'
              }
            `}
          >
            Enter Dashboard
            <ArrowRight size={16} strokeWidth={1.5} />
          </motion.button>
        </motion.div>
      )}

    </div>
  )
}

function RoleCard({ icon, title, description, accent, onClick, variants }) {
  const accentMap = {
    forest: {
      border:  'hover:border-forest-mid',
      bg:      'hover:bg-forest-pale',
      iconBg:  'bg-forest-light text-forest',
      stripe:  'bg-forest',
    },
    gold: {
      border:  'hover:border-gold',
      bg:      'hover:bg-gold-pale',
      iconBg:  'bg-gold-pale text-gold-dark',
      stripe:  'bg-gold',
    },
  }
  const a = accentMap[accent]

  return (
    <motion.button
      variants={variants}
      onClick={onClick}
      className={`
        relative overflow-hidden text-left w-full
        bg-cream border border-cream-border rounded-xl p-6
        transition-all duration-200 group
        ${a.border} ${a.bg}
      `}
    >
      {/* Top stripe */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${a.stripe} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${a.iconBg}`}>
        {icon}
      </div>
      <p className="font-serif text-lg text-ink mb-1">{title}</p>
      <p className="font-sans text-xs text-ink/50 leading-relaxed">{description}</p>

      <div className="mt-4 flex items-center gap-1 font-mono text-xs text-ink/30 group-hover:text-ink/60 transition-colors">
        Continue <ArrowRight size={12} strokeWidth={1.5} />
      </div>
    </motion.button>
  )
}