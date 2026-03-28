import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Loader2 } from 'lucide-react'
import { fireConfetti } from '../../utils/confetti'
import { useApp } from '../../context/AppContext'

export default function SubmitModal({ assignment, onClose }) {
  const { currentUser, dispatch } = useApp()
  const [step, setStep]       = useState('confirm')  // 'confirm' | 'loading' | 'done'

  if (!assignment) return null

  function handleConfirm() {
    setStep('loading')
    setTimeout(() => {
      dispatch({
        type: 'SUBMIT_ASSIGNMENT',
        payload: { studentId: currentUser.id, assignmentId: assignment.id },
      })
      fireConfetti()
      setStep('done')
      setTimeout(onClose, 800)
    }, 500)
  }

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink z-50"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-cream dark:bg-[#1F1F18] border border-cream-border dark:border-cream/10 rounded-2xl w-full max-w-sm shadow-none pointer-events-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-4 border-b border-cream-border dark:border-cream/10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/30 mb-1">Confirm submission</p>
              <h2 className="font-serif text-lg text-ink dark:text-cream leading-snug">{assignment.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-ink/30 dark:text-cream/30 hover:text-ink dark:hover:text-cream transition-colors mt-0.5"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <p className="font-sans text-sm text-ink/60 dark:text-cream/50 leading-relaxed">
              Make sure you've submitted your work via the Drive link before confirming here.
              This action logs your submission in EduTrack.
            </p>

            <a
              href={assignment.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs text-forest-mid hover:text-forest transition-colors"
            >
              <ExternalLink size={13} strokeWidth={1.5} />
              Open submission folder
            </a>

            {step === 'confirm' && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-cream-border dark:border-cream/15 font-sans text-sm text-ink/60 dark:text-cream/50 hover:border-ink/30 dark:hover:border-cream/30 transition-colors"
                >
                  Not yet
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-forest text-cream font-sans text-sm font-medium hover:bg-forest-mid transition-colors"
                >
                  Yes, I submitted
                </button>
              </div>
            )}

            {step === 'loading' && (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={20} strokeWidth={1.5} className="animate-spin text-forest-mid" />
              </div>
            )}

            {step === 'done' && (
              <div className="flex items-center justify-center py-3">
                <p className="font-serif text-base italic text-forest-mid">Logged! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}