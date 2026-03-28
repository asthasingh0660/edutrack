export function exportCSV(assignment, students, submissions) {
  const rows = [
    ['Student Name', 'Email', 'Status', 'Submitted At'],
    ...students.map((s) => {
      const sub = submissions.find(
        (x) => x.studentId === s.id && x.assignmentId === assignment.id
      )
      return [
        s.name,
        s.email,
        sub ? 'Submitted' : 'Not Submitted',
        sub ? new Date(sub.submittedAt).toLocaleString() : 'N/A',
      ]
    }),
  ]

  const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n')

  // BOM prefix tells Excel this is UTF-8
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `edutrack-${assignment.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}