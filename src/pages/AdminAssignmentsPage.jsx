import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, ExternalLink, Users, Download, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CreateDrawer from '../components/admin/CreateDrawer'
import { getDeadlineLabel, isOverdue } from '../utils/dates'
import { exportCSV } from '../utils/csvExport'

const COLUMNS = [
  { id: 'active',   label: 'Active',   color: 'border-t-forest-mid' },
  { id: 'soon',     label: 'Due Soon', color: 'border-t-gold' },
  { id: 'overdue',  label: 'Overdue',  color: 'border-t-coral' },
]

function getColumn(assignment) {
  const { level } = getDeadlineLabel(assignment.dueDate)
  if (level === 'overdue') return 'overdue'
  if (level === 'soon')    return 'soon'
  return 'active'
}

export default function AdminAssignmentsPage() {
  const { currentUser, assignments, submissions, allStudents, dispatch } = useApp()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const myAssignments = useMemo(() =>
    assignments.filter(a => a.professorId === currentUser?.id),
  [assignments, currentUser])

  const columns = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      items: myAssignments.filter(a => getColumn(a) === col.id),
    }))
  }, [myAssignments])

  function handleDelete(id) {
    if (confirm('Delete this assignment? This cannot be undone.')) {
      dispatch({ type: 'DELETE_ASSIGNMENT', payload: id })
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <h2 className="font-serif text-2xl text-ink dark:text-cream">Assignments</h2>
            <p className="font-sans text-sm text-ink/40 dark:text-cream/50">
              {myAssignments.length} total · Kanban view by deadline status
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

        {/* Kanban board */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
        >
          {columns.map((col) => (
            <div key={col.id} className="space-y-3">
              {/* Column header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    col.id === 'overdue' ? 'bg-coral' :
                    col.id === 'soon'    ? 'bg-gold'   : 'bg-forest-mid'
                  }`} />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/40">
                    {col.label}
                  </p>
                </div>
                <span className="font-mono text-[10px] bg-cream-dark dark:bg-cream/10 text-ink/40 dark:text-cream/40 px-2 py-0.5 rounded-full border border-cream-border dark:border-cream/10">
                  {col.items.length}
                </span>
              </div>

              {/* Cards */}
              {col.items.length === 0 ? (
                <div className="border-2 border-dashed border-cream-border dark:border-cream/10 rounded-xl p-6 text-center">
                  <p className="font-serif text-sm italic text-ink/25 dark:text-cream/25">
                    Nothing here
                  </p>
                </div>
              ) : (
                col.items.map((assignment) => {
                  const subs = submissions.filter(s => s.assignmentId === assignment.id)
                  const pct  = allStudents.length
                    ? Math.round((subs.length / allStudents.length) * 100)
                    : 0
                  const isExpanded = expandedId === assignment.id
                  const { label } = getDeadlineLabel(assignment.dueDate)

                  return (
                    <motion.div
                      key={assignment.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        bg-cream dark:bg-cream/5 border rounded-xl overflow-hidden
                        ${col.id === 'overdue'
                          ? 'border-coral/25 dark:border-coral/20'
                          : col.id === 'soon'
                          ? 'border-gold/30 dark:border-gold/20'
                          : 'border-cream-border dark:border-cream/10'
                        }
                      `}
                    >
                      {/* Top stripe */}
                      <div className={`h-[3px] w-full ${
                        col.id === 'overdue' ? 'bg-coral' :
                        col.id === 'soon'    ? 'bg-gold'  : 'bg-forest-mid'
                      }`} />

                      <div className="p-4 space-y-3">
                        {/* Title + deadline */}
                        <div>
                          <p className="font-sans font-medium text-sm text-ink dark:text-cream leading-snug">
                            {assignment.title}
                          </p>
                          <p className="font-mono text-[10px] text-ink/40 dark:text-cream/40 mt-0.5">
                            {assignment.subject} · {label}
                          </p>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-ink/30 dark:text-cream/30">Submissions</span>
                            <span className="font-mono text-[10px] text-ink/50 dark:text-cream/50">
                              {subs.length}/{allStudents.length}
                            </span>
                          </div>
                          <div className="h-1.5 bg-cream-dark dark:bg-cream/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-forest-mid rounded-full progress-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        {assignment.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {assignment.tags.map(tag => (
                              <span key={tag} className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-cream-dark dark:bg-cream/8 text-ink/40 dark:text-cream/50 border border-cream-border dark:border-cream/15">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-cream-border dark:border-cream/10">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                            className="flex items-center gap-1.5 font-mono text-[10px] text-ink/40 dark:text-cream/40 hover:text-forest-mid transition-colors"
                          >
                            <Users size={11} strokeWidth={1.5} />
                            {isExpanded ? 'Hide students' : 'Show students'}
                          </button>
                          <div className="flex items-center gap-1">
                            <a
                              href={assignment.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-ink/30 dark:text-cream/30 hover:text-forest-mid transition-colors"
                            >
                              <ExternalLink size={13} strokeWidth={1.5} />
                            </a>
                            <button
                              onClick={() => exportCSV(assignment, allStudents, submissions)}
                              className="p-1.5 rounded-lg text-ink/30 dark:text-cream/30 hover:text-forest-mid transition-colors"
                            >
                              <Download size={13} strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleDelete(assignment.id)}
                              className="p-1.5 rounded-lg text-ink/30 dark:text-cream/30 hover:text-coral transition-colors"
                            >
                              <Trash2 size={13} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>

                        {/* Expanded student list */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-cream-border dark:border-cream/10 pt-3 space-y-2"
                          >
                            {allStudents.map(student => {
                              const sub = subs.find(s => s.studentId === student.id)
                              return (
                                <div key={student.id} className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] flex-shrink-0
                                    ${sub ? 'bg-forest-light dark:bg-forest/20 text-forest dark:text-forest-mid' : 'bg-cream-dark dark:bg-cream/10 text-ink/40 dark:text-cream/40'}
                                  `}>
                                    {student.avatar}
                                  </div>
                                  <span className="font-sans text-xs text-ink dark:text-cream flex-1 truncate">
                                    {student.name}
                                  </span>
                                  <span className={`font-mono text-[9px] ${sub ? 'text-forest-mid' : 'text-ink/30 dark:text-cream/30'}`}>
                                    {sub ? '✓' : '—'}
                                  </span>
                                </div>
                              )
                            })}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <CreateDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}