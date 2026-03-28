import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, BookOpen, Users, AlertTriangle, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useCountUp } from '../hooks/useCountUp'
import AssignmentAccordion from '../components/admin/AssignmentAccordion'
import CreateDrawer from '../components/admin/CreateDrawer'
import SubmissionChart from '../components/charts/SubmissionChart'
import SearchBar from '../components/ui/SearchBar'
import { isOverdue } from '../utils/dates'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function AdminDashboard() {
  const { currentUser, assignments, submissions, allStudents } = useApp()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Only show assignments this professor created
  const myAssignments = useMemo(() =>
    assignments.filter((a) => a.professorId === currentUser?.id),
  [assignments, currentUser])

  const filtered = useMemo(() =>
    myAssignments.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    ),
  [myAssignments, search])

  // Metrics
  const totalAssignments = myAssignments.length
  const totalStudents    = allStudents.length
  const totalSubs        = submissions.filter((s) =>
    myAssignments.some((a) => a.id === s.assignmentId)
  ).length
  const totalPossible    = myAssignments.length * totalStudents
  const submissionRate   = totalPossible ? Math.round((totalSubs / totalPossible) * 100) : 0
  const overdueCount     = myAssignments.filter((a) => isOverdue(a.dueDate)).length

  const assignmentsRef    = useCountUp(totalAssignments)
  const rateRef           = useCountUp(submissionRate)
  const overdueRef        = useCountUp(overdueCount)

  return (
    <>
      <div className="space-y-6">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <h2 className="font-serif text-2xl text-ink dark:text-cream">
              {currentUser?.name}
            </h2>
            <p className="font-sans text-sm text-ink/40 dark:text-cream/30">
              {currentUser?.subject} · Professor Portal
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-pill bg-gold text-ink font-sans text-sm font-medium hover:bg-gold-dark hover:text-cream transition-colors"
          >
            <Plus size={15} strokeWidth={2} />
            New Assignment
          </button>
        </motion.div>

        {/* ── Metric cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          <MetricCard
            variants={item}
            icon={<BookOpen size={16} strokeWidth={1.5} />}
            label="Assignments"
            valueRef={assignmentsRef}
            accent="forest"
          />
          <MetricCard
            variants={item}
            icon={<TrendingUp size={16} strokeWidth={1.5} />}
            label="Submission Rate"
            valueRef={rateRef}
            suffix="%"
            accent="gold"
          />
          <MetricCard
            variants={item}
            icon={<AlertTriangle size={16} strokeWidth={1.5} />}
            label="Overdue"
            valueRef={overdueRef}
            accent={overdueCount > 0 ? 'coral' : 'forest'}
          />
        </motion.div>

        {/* ── Chart ── */}
        {myAssignments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/30 mb-4">
              Submissions per Assignment
            </p>
            <SubmissionChart
              assignments={myAssignments}
              submissions={submissions}
              students={allStudents}
            />
          </motion.div>
        )}

        {/* ── Assignment list ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/30">
              Your Assignments ({filtered.length})
            </p>
            <div className="w-full sm:w-64">
              <SearchBar value={search} onChange={setSearch} placeholder="Search assignments…" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-lg italic text-ink/30 dark:text-cream/25">
                {search ? 'No matches found.' : 'No assignments yet — create one!'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((assignment) => (
                <AssignmentAccordion
                  key={assignment.id}
                  assignment={assignment}
                  students={allStudents}
                  submissions={submissions}
                />
              ))}
            </div>
          )}
        </motion.div>

      </div>

      {/* ── Create drawer ── */}
      <CreateDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

const accentMap = {
  forest: { bg: 'bg-forest-pale dark:bg-forest/10', icon: 'text-forest-mid', value: 'text-forest' },
  gold:   { bg: 'bg-gold-pale dark:bg-gold/10',     icon: 'text-gold-dark',  value: 'text-gold-dark dark:text-gold' },
  coral:  { bg: 'bg-coral-pale dark:bg-coral/10',   icon: 'text-coral',      value: 'text-coral' },
}

function MetricCard({ icon, label, valueRef, suffix = '', accent = 'forest', variants }) {
  const a = accentMap[accent]
  return (
    <motion.div
      variants={variants}
      className="bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-4 space-y-3"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.bg}`}>
        <span className={a.icon}>{icon}</span>
      </div>
      <div>
        <div className="flex items-baseline gap-0.5">
          <span ref={valueRef} className={`font-serif text-2xl ${a.value}`}>0</span>
          {suffix && <span className={`font-serif text-lg ${a.value}`}>{suffix}</span>}
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/30">{label}</p>
      </div>
    </motion.div>
  )
}