import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'

export default function UndoSnackbar() {
  const { pendingUndo, dispatch } = useApp()

  useEffect(() => {
    if (!pendingUndo) return
    const timer = setTimeout(() => {
      dispatch({ type: 'CLEAR_UNDO' })
    }, 5000)
    return () => clearTimeout(timer)
  }, [pendingUndo, dispatch])

  function handleUndo() {
    dispatch({ type: 'UNDO_SUBMISSION' })
  }

  return (
    <AnimatePresence>
      {pendingUndo && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
          <div className="bg-ink dark:bg-cream/95 rounded-xl overflow-hidden shadow-none border border-cream/10 dark:border-ink/10">
            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <p className="font-sans text-sm text-cream dark:text-ink">
                Submission logged.
              </p>
              <button
                onClick={handleUndo}
                className="font-mono text-xs text-forest-mid dark:text-forest hover:text-forest-light dark:hover:text-forest transition-colors flex-shrink-0"
              >
                Undo
              </button>
            </div>
            {/* Countdown bar */}
            <div className="h-0.5 bg-cream/10 dark:bg-ink/10">
              <div
                className="h-full bg-forest-mid snackbar-progress"
                style={{ animationDuration: '5s' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}