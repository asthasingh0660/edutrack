import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useSearch } from '../hooks/useSearch'
import { useCountUp } from '../hooks/useCountUp'
import ProgressRing from '../components/ui/ProgressRing'
import UrgentBanner from '../components/assignments/UrgentBanner'
import AssignmentCard from '../components/assignments/AssignmentCard'
import SubmitModal from '../components/submission/SubmitModal'
import UndoSnackbar from '../components/submission/UndoSnackbar'
import { SkeletonCard } from '../components/ui/Skeleton'
import { isOverdue, isDueSoon } from '../utils/dates'

export default function StudentDashboard() {
  const { currentUser, assignments, submissions } = useApp()
  const navigate = useNavigate()
  const [modalAssignment, setModalAssignment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  // Enrich assignments
  const enriched = useMemo(() => {
    return assignments.map((a) => {
      const submitted = submissions.some(
        (s) => s.studentId === currentUser?.id && s.assignmentId === a.id
      )
      const overdue = !submitted && isOverdue(a.dueDate)
      const soon = !submitted && !overdue && isDueSoon(a.dueDate)
      return { ...a, submitted, overdue, soon }
    })
  }, [assignments, submissions, currentUser])

  const total          = enriched.length
  const submittedCount = enriched.filter(a => a.submitted).length
  const overdueCount   = enriched.filter(a => a.overdue).length
  const pendingCount   = enriched.filter(a => !a.submitted && !a.overdue).length

  const urgent = enriched.filter(a => a.soon && !a.submitted)

  // Dashboard shows: overdue first, then due soon, then pending — max 4
  const preview = useMemo(() => {
    const overdue = enriched.filter(a => a.overdue)
    const soon    = enriched.filter(a => a.soon && !a.submitted)
    const pending = enriched.filter(a => !a.submitted && !a.overdue && !a.soon)
    return [...overdue, ...soon, ...pending].slice(0, 4)
  }, [enriched])

  const submittedRef = useCountUp(submittedCount)
  const totalRef     = useCountUp(total)
  const overdueRef   = useCountUp(overdueCount)
  const pendingRef   = useCountUp(pendingCount)

  return (
    <>
      <div className="mx-auto space-y-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center gap-6"
        >
          <div className="flex-shrink-0">
            {loading
              ? <div className="skeleton rounded-full" style={{ width: 120, height: 120 }} />
              : <ProgressRing value={submittedCount} total={total} />
            }
          </div>

          <div className="flex-1 space-y-1">
            <h2 className="font-serif text-2xl text-ink dark:text-cream">
              {currentUser?.name?.split(' ')[0]}'s Dashboard
            </h2>
            <p className="font-sans text-sm text-ink/50 dark:text-cream/50">
              {currentUser?.subject} · {currentUser?.email}
            </p>

            <div className="flex gap-6 pt-2 flex-wrap">
              <Stat label="Total"     valueRef={totalRef} />
              <Stat label="Submitted" valueRef={submittedRef} color="text-forest-mid" />
              <Stat label="Pending"   valueRef={pendingRef}   color="text-gold-dark dark:text-gold" />
              {overdueCount > 0 && (
                <Stat label="Overdue" valueRef={overdueRef} color="text-coral" />
              )}
            </div>

            <div className="pt-2">
              <div className="h-1.5 bg-cream-dark dark:bg-cream/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-mid rounded-full progress-fill"
                  style={{ width: `${total ? (submittedCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Urgent banner ── */}
        {!loading && <UrgentBanner assignments={urgent} />}

        {/* ── Quick stat cards ── */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            <QuickCard
              icon={<CheckCircle2 size={15} strokeWidth={1.5} />}
              label="Completed"
              value={`${total ? Math.round((submittedCount/total)*100) : 0}%`}
              color="forest"
            />
            <QuickCard
              icon={<Clock size={15} strokeWidth={1.5} />}
              label="Pending"
              value={pendingCount}
              color="gold"
            />
            <QuickCard
              icon={<AlertTriangle size={15} strokeWidth={1.5} />}
              label="Overdue"
              value={overdueCount}
              color={overdueCount > 0 ? 'coral' : 'forest'}
            />
          </motion.div>
        )}

        {/* ── Priority assignments preview ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40">
              Needs Attention
            </p>
            <button
              onClick={() => navigate('/assignments')}
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-forest-mid hover:text-forest transition-colors"
            >
              View all <ArrowRight size={11} strokeWidth={1.5} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : preview.length === 0 ? (
            <div className="text-center py-12 border border-cream-border dark:border-cream/10 rounded-xl">
              <p className="font-serif text-lg italic text-ink/30 dark:text-cream/30">
                All caught up — nothing needs attention.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {preview.map((assignment) => {
                const submission = submissions.find(
                  (s) => s.studentId === currentUser?.id && s.assignmentId === assignment.id
                )
                return (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    submission={submission}
                    onSubmit={setModalAssignment}
                  />
                )
              })}
            </div>
          )}

          {/* View all CTA */}
          {!loading && preview.length > 0 && (
            <button
              onClick={() => navigate('/assignments')}
              className="w-full py-3 rounded-xl border border-cream-border dark:border-cream/10 font-sans text-sm text-ink/50 dark:text-cream/40 hover:border-forest-mid hover:text-forest-mid transition-colors flex items-center justify-center gap-2"
            >
              View all {total} assignments
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          )}
        </motion.div>

      </div>

      <SubmitModal
        assignment={modalAssignment}
        onClose={() => setModalAssignment(null)}
      />
      <UndoSnackbar />
    </>
  )
}

function Stat({ label, valueRef, color = 'text-ink dark:text-cream' }) {
  return (
    <div>
      <span ref={valueRef} className={`font-serif text-2xl ${color}`}>0</span>
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/30">{label}</p>
    </div>
  )
}

const quickColorMap = {
  forest: { bg: 'bg-forest-pale dark:bg-forest/10', icon: 'text-forest-mid', value: 'text-forest dark:text-forest-mid' },
  gold:   { bg: 'bg-gold-pale dark:bg-gold/10',     icon: 'text-gold-dark dark:text-gold',  value: 'text-gold-dark dark:text-gold' },
  coral:  { bg: 'bg-coral-pale dark:bg-coral/10',   icon: 'text-coral',      value: 'text-coral' },
}

function QuickCard({ icon, label, value, color }) {
  const c = quickColorMap[color]
  return (
    <div className="bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-4 space-y-2">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.bg}`}>
        <span className={c.icon}>{icon}</span>
      </div>
      <div>
        <p className={`font-serif text-xl ${c.value}`}>{value}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40">{label}</p>
      </div>
    </div>
  )
}