import { useState, useEffect, useMemo } from 'react'
import { isOverdue, isDueSoon } from '../utils/dates'

export function useSearch(assignments, submissions, studentId) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')   // all | submitted | pending | overdue
  const [subjectFilter, setSubjectFilter] = useState('all') // all | Maths | Physics | Literature

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const enriched = useMemo(() => {
    return assignments.map((a) => {
      const submitted = submissions.some(
        (s) => s.assignmentId === a.id && s.studentId === studentId
      )
      const overdue = !submitted && isOverdue(a.dueDate)
      const soon    = !submitted && !overdue && isDueSoon(a.dueDate)
      return { ...a, submitted, overdue, soon }
    })
  }, [assignments, submissions, studentId])

  const filtered = useMemo(() => {
    return enriched.filter((a) => {
      const matchesQuery =
        !debouncedQuery ||
        a.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        a.subject.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(debouncedQuery.toLowerCase()))

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'submitted' && a.submitted) ||
        (statusFilter === 'pending'   && !a.submitted && !a.overdue) ||
        (statusFilter === 'overdue'   && a.overdue)

      const matchesSubject =
        subjectFilter === 'all' || a.subject === subjectFilter

      return matchesQuery && matchesStatus && matchesSubject
    })
  }, [enriched, debouncedQuery, statusFilter, subjectFilter])

  return {
    query, setQuery,
    statusFilter, setStatusFilter,
    subjectFilter, setSubjectFilter,
    filtered,
    total: enriched.length,
    submittedCount: enriched.filter((a) => a.submitted).length,
    overdueCount: enriched.filter((a) => a.overdue).length,
  }
}