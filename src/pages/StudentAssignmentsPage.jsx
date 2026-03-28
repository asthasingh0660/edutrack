import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useSearch } from '../hooks/useSearch'
import SearchBar from '../components/ui/SearchBar'
import FilterBar from '../components/assignments/FilterBar'
import AssignmentCard from '../components/assignments/AssignmentCard'
import SubmitModal from '../components/submission/SubmitModal'
import UndoSnackbar from '../components/submission/UndoSnackbar'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function StudentAssignmentsPage() {
  const { currentUser, assignments, submissions } = useApp()
  const [modalAssignment, setModalAssignment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const {
    query, setQuery,
    statusFilter, setStatusFilter,
    subjectFilter, setSubjectFilter,
    filtered,
    total,
    submittedCount,
    overdueCount,
  } = useSearch(assignments, submissions, currentUser?.id)

  const emptyVariant =
    query || statusFilter !== 'all' || subjectFilter !== 'all'
      ? 'search'
      : statusFilter

  return (
    <>
      <div className="mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-serif text-2xl text-ink dark:text-cream">All Assignments</h2>
          <p className="font-sans text-sm text-ink/40 dark:text-cream/50 mt-0.5">
            {submittedCount} of {total} submitted
            {overdueCount > 0 && (
              <span className="text-coral ml-2">· {overdueCount} overdue</span>
            )}
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3"
        >
          <SearchBar value={query} onChange={setQuery} />
          <FilterBar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
          />
        </motion.div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState variant={emptyVariant} />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((assignment) => {
                const submission = submissions.find(
                  (s) => s.studentId === currentUser?.id && s.assignmentId === assignment.id
                )
                return (
                  <motion.div key={assignment.id} variants={cardVariant} layout>
                    <AssignmentCard
                      assignment={assignment}
                      submission={submission}
                      onSubmit={setModalAssignment}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modalAssignment && (
          <SubmitModal
            assignment={modalAssignment}
            onClose={() => setModalAssignment(null)}
          />
        )}
      </AnimatePresence>

      <UndoSnackbar />
    </>
  )
}