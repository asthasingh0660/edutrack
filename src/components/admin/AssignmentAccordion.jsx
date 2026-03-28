import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Download, Trash2 } from 'lucide-react'
import StudentRow from './StudentRow'
import { exportCSV } from '../../utils/csvExport'
import { getDeadlineLabel } from '../../utils/dates'
import { useApp } from '../../context/AppContext'

export default function AssignmentAccordion({ assignment, students, submissions }) {
  const { dispatch } = useApp()
  const [open, setOpen] = useState(false)

  const assignmentSubs = submissions.filter((s) => s.assignmentId === assignment.id)
  const submittedCount = assignmentSubs.length
  const total = students.length
  const pct = total ? Math.round((submittedCount / total) * 100) : 0
  const { label, level } = getDeadlineLabel(assignment.dueDate)

  function handleDelete() {
    if (confirm(`Delete "${assignment.title}"? This cannot be undone.`)) {
      dispatch({ type: 'DELETE_ASSIGNMENT', payload: assignment.id })
    }
  }

  return (
    <div className="border border-cream-border dark:border-cream/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center gap-3 px-4 py-4 bg-cream dark:bg-cream/5 hover:bg-cream-dark dark:hover:bg-cream/8 transition-colors">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 min-w-0 flex items-center gap-3 text-left"
          aria-expanded={open}
          aria-label={`Toggle ${assignment.title} details`}
        >
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-sans font-medium text-sm text-ink dark:text-cream truncate">{assignment.title}</p>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0
                ${level === 'overdue'
                  ? 'bg-coral-pale text-coral border-coral/20 dark:bg-coral/15 dark:text-coral dark:border-coral/30'
                  : level === 'soon'
                  ? 'bg-gold-pale text-gold-dark border-gold/30 dark:bg-gold/15 dark:text-gold dark:border-gold/30'
                  : 'bg-cream-dark text-ink/60 border-cream-border dark:bg-cream/10 dark:text-cream/70 dark:border-cream/20'}
              `}>
                {label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-cream-dark dark:bg-cream/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-mid rounded-full progress-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-ink/40 dark:text-cream/30 flex-shrink-0">
                {submittedCount}/{total}
              </span>
            </div>
          </div>

          <ChevronDown
            size={16} strokeWidth={1.5}
            className={`text-ink/30 dark:text-cream/30 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <button
            type="button"
            onClick={() => exportCSV(assignment, students, submissions)}
            className="p-1.5 rounded-lg text-ink/30 dark:text-cream/30 hover:text-forest-mid hover:bg-forest-pale dark:hover:bg-forest/10 transition-colors"
            aria-label="Export CSV"
          >
            <Download size={14} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-ink/30 dark:text-cream/30 hover:text-coral hover:bg-coral-pale dark:hover:bg-coral/10 transition-colors"
            aria-label="Delete assignment"
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Expanded student list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-2 pt-1 border-t border-cream-border dark:border-cream/10 bg-cream-dark/40 dark:bg-cream/3">
              {students.map((student) => {
                const sub = assignmentSubs.find((s) => s.studentId === student.id)
                return (
                  <StudentRow
                    key={student.id}
                    student={student}
                    submission={sub}
                    dueDate={assignment.dueDate}
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}