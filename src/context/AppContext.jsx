import { createContext, useContext, useReducer, useEffect } from 'react'
import { students, professors } from '../data/students'
import { assignments } from '../data/assignments'
import { seedSubmissions } from '../data/submissions'

// ── Initial State ──────────────────────────────────────────────
const getInitialState = () => {
  try {
    const saved = localStorage.getItem('edutrack_state')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Always use fresh assignments (dates stay relative)
      return { ...parsed, assignments }
    }
  } catch {}

  return {
    // Auth
    currentUser: null,   // student or professor object
    role: null,          // 'student' | 'admin'

    // Data
    assignments,
    submissions: seedSubmissions,

    // UI
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    pendingUndo: null,   // { studentId, assignmentId, submittedAt }
  }
}

// ── Reducer ────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'LOGIN': {
      return {
        ...state,
        currentUser: action.payload.user,
        role: action.payload.role,
      }
    }

    case 'LOGOUT': {
      return {
        ...state,
        currentUser: null,
        role: null,
      }
    }

    case 'SUBMIT_ASSIGNMENT': {
      const { studentId, assignmentId } = action.payload
      // Prevent duplicate
      const already = state.submissions.some(
        (s) => s.studentId === studentId && s.assignmentId === assignmentId
      )
      if (already) return state

      const newSub = { studentId, assignmentId, submittedAt: new Date().toISOString() }
      return {
        ...state,
        submissions: [...state.submissions, newSub],
        pendingUndo: newSub,
      }
    }

    case 'UNDO_SUBMISSION': {
      if (!state.pendingUndo) return state
      const { studentId, assignmentId } = state.pendingUndo
      return {
        ...state,
        submissions: state.submissions.filter(
          (s) => !(s.studentId === studentId && s.assignmentId === assignmentId)
        ),
        pendingUndo: null,
      }
    }

    case 'CLEAR_UNDO': {
      return { ...state, pendingUndo: null }
    }

    case 'ADD_ASSIGNMENT': {
      return {
        ...state,
        assignments: [action.payload, ...state.assignments],
      }
    }

    case 'DELETE_ASSIGNMENT': {
      return {
        ...state,
        assignments: state.assignments.filter((a) => a.id !== action.payload),
        submissions: state.submissions.filter((s) => s.assignmentId !== action.payload),
      }
    }

    case 'TOGGLE_DARK_MODE': {
      return { ...state, darkMode: !state.darkMode }
    }

    case 'RESET_DEMO': {
      localStorage.removeItem('edutrack_state')
      return { ...getInitialState(), darkMode: state.darkMode }
    }

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)

  // Persist to localStorage (skip assignments — they use relative dates)
  useEffect(() => {
    const { assignments: _, ...rest } = state
    localStorage.setItem('edutrack_state', JSON.stringify(rest))
  }, [state])

  // Dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode)
  }, [state.darkMode])

  // Convenience selectors
  const allStudents   = students
  const allProfessors = professors

  const getStudentSubmissions = (studentId) =>
    state.submissions.filter((s) => s.studentId === studentId)

  const getAssignmentSubmissions = (assignmentId) =>
    state.submissions.filter((s) => s.assignmentId === assignmentId)

  const isSubmitted = (studentId, assignmentId) =>
    state.submissions.some(
      (s) => s.studentId === studentId && s.assignmentId === assignmentId
    )

  return (
    <AppContext.Provider value={{
      ...state,
      dispatch,
      allStudents,
      allProfessors,
      getStudentSubmissions,
      getAssignmentSubmissions,
      isSubmitted,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}