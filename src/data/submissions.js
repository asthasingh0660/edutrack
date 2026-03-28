// Pre-seeded so the dashboard isn't empty on first load.
// Format: { studentId, assignmentId, submittedAt }
export const seedSubmissions = [
  { studentId: 's1', assignmentId: 'a2', submittedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { studentId: 's1', assignmentId: 'a3', submittedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { studentId: 's2', assignmentId: 'a4', submittedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { studentId: 's2', assignmentId: 'a5', submittedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { studentId: 's3', assignmentId: 'a8', submittedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { studentId: 's4', assignmentId: 'a1', submittedAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { studentId: 's4', assignmentId: 'a2', submittedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { studentId: 's5', assignmentId: 'a5', submittedAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { studentId: 's5', assignmentId: 'a7', submittedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { studentId: 's6', assignmentId: 'a9', submittedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { studentId: 's7', assignmentId: 'a1', submittedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { studentId: 's7', assignmentId: 'a3', submittedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { studentId: 's8', assignmentId: 'a4', submittedAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { studentId: 's8', assignmentId: 'a6', submittedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
]