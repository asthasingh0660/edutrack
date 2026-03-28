import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Link2, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const empty = {
  title: '', subject: 'Maths', description: '',
  driveLink: '', dueDate: '', totalMarks: '',
}

function validate(form) {
  const errors = {}
  if (!form.title.trim())       errors.title       = 'Title is required'
  if (!form.description.trim()) errors.description = 'Description is required'
  if (!form.driveLink.trim())   errors.driveLink   = 'Drive link is required'
  else if (!form.driveLink.startsWith('http')) errors.driveLink = 'Must be a valid URL'
  if (!form.dueDate)            errors.dueDate     = 'Due date is required'
  if (!form.totalMarks || isNaN(Number(form.totalMarks)) || Number(form.totalMarks) <= 0)
    errors.totalMarks = 'Enter a valid mark value'
  return errors
}

export default function CreateDrawer({ open, onClose }) {
  const { currentUser, dispatch } = useApp()
  const [form, setForm]     = useState(empty)
  const [errors, setErrors] = useState({})
  const [step, setStep]     = useState('form') // 'form' | 'confirm'

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function handleNext() {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setStep('confirm')
  }

  function handlePublish() {
    dispatch({
      type: 'ADD_ASSIGNMENT',
      payload: {
        id: `a${Date.now()}`,
        title: form.title.trim(),
        subject: form.subject,
        professorId: currentUser.id,
        description: form.description.trim(),
        driveLink: form.driveLink.trim(),
        dueDate: new Date(form.dueDate).toISOString(),
        totalMarks: Number(form.totalMarks),
        tags: [],
      },
    })
    setForm(empty)
    setErrors({})
    setStep('form')
    onClose()
  }

  function handleClose() {
    setForm(empty)
    setErrors({})
    setStep('form')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-ink z-40"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-cream dark:bg-[#1A1A14] border-l border-cream-border dark:border-cream/10 z-50 flex flex-col"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-border dark:border-cream/10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/30 mb-0.5">
                  New Assignment
                </p>
                <h2 className="font-serif text-xl text-ink dark:text-cream">Create Assignment</h2>
              </div>
              <button onClick={handleClose} className="text-ink/30 dark:text-cream/30 hover:text-ink dark:hover:text-cream transition-colors">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              {step === 'form' && (
                <>
                  <Field label="Title" error={errors.title}>
                    <input
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      placeholder="e.g. Calculus Problem Set 4"
                      className={input(errors.title)}
                    />
                  </Field>

                  <Field label="Subject" error={errors.subject}>
                    <select
                      value={form.subject}
                      onChange={(e) => set('subject', e.target.value)}
                      className={input(false)}
                    >
                      <option>Maths</option>
                      <option>Physics</option>
                      <option>Literature</option>
                    </select>
                  </Field>

                  <Field label="Description" error={errors.description}>
                    <textarea
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      placeholder="Instructions for students…"
                      rows={3}
                      className={`${input(errors.description)} resize-none`}
                    />
                  </Field>

                  <Field label="Drive Link" error={errors.driveLink}>
                    <div className="relative">
                      <Link2 size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 dark:text-cream/30" />
                      <input
                        value={form.driveLink}
                        onChange={(e) => set('driveLink', e.target.value)}
                        placeholder="https://drive.google.com/…"
                        className={`${input(errors.driveLink)} pl-8`}
                      />
                    </div>
                    {form.driveLink.startsWith('http') && (
                      <p className="font-mono text-[10px] text-forest-mid mt-1 truncate">
                        {new URL(form.driveLink).hostname}
                      </p>
                    )}
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Due Date" error={errors.dueDate}>
                      <input
                        type="datetime-local"
                        value={form.dueDate}
                        onChange={(e) => set('dueDate', e.target.value)}
                        className={input(errors.dueDate)}
                      />
                    </Field>
                    <Field label="Total Marks" error={errors.totalMarks}>
                      <input
                        type="number"
                        value={form.totalMarks}
                        onChange={(e) => set('totalMarks', e.target.value)}
                        placeholder="100"
                        min="1"
                        className={input(errors.totalMarks)}
                      />
                    </Field>
                  </div>
                </>
              )}

              {step === 'confirm' && (
                <div className="space-y-4">
                  <div className="bg-cream-dark dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-4 space-y-2">
                    <Row label="Title"       value={form.title} />
                    <Row label="Subject"     value={form.subject} />
                    <Row label="Due"         value={new Date(form.dueDate).toLocaleString()} />
                    <Row label="Marks"       value={form.totalMarks} />
                    <Row label="Drive"       value={form.driveLink} truncate />
                  </div>
                  <div className="flex items-start gap-2 bg-gold-pale border border-gold/30 rounded-xl px-4 py-3">
                    <AlertCircle size={14} strokeWidth={1.5} className="text-gold-dark mt-0.5 flex-shrink-0" />
                    <p className="font-sans text-xs text-gold-dark leading-relaxed">
                      This will publish the assignment to all students in {form.subject}.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-cream-border dark:border-cream/10 flex gap-2">
              {step === 'form' && (
                <>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-xl border border-cream-border dark:border-cream/15 font-sans text-sm text-ink/60 dark:text-cream/50 hover:border-ink/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-2.5 rounded-xl bg-gold text-ink font-sans text-sm font-medium hover:bg-gold-dark hover:text-cream transition-colors"
                  >
                    Review
                  </button>
                </>
              )}
              {step === 'confirm' && (
                <>
                  <button
                    onClick={() => setStep('form')}
                    className="flex-1 py-2.5 rounded-xl border border-cream-border dark:border-cream/15 font-sans text-sm text-ink/60 dark:text-cream/50 hover:border-ink/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handlePublish}
                    className="flex-1 py-2.5 rounded-xl bg-forest text-cream font-sans text-sm font-medium hover:bg-forest-mid transition-colors"
                  >
                    Publish
                  </button>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      <label className="font-mono text-[10px] uppercase tracking-widest text-ink/40 dark:text-cream/30">
        {label}
      </label>
      {children}
      {error && (
        <p className="font-mono text-[10px] text-coral">{error}</p>
      )}
    </div>
  )
}

function Row({ label, value, truncate }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/30 flex-shrink-0">{label}</span>
      <span className={`font-sans text-xs text-ink dark:text-cream text-right ${truncate ? 'truncate max-w-[220px]' : ''}`}>{value}</span>
    </div>
  )
}

function input(hasError) {
  return `
    w-full px-3 py-2.5 rounded-xl
    bg-cream-dark dark:bg-cream/8
    border ${hasError ? 'border-coral' : 'border-cream-border dark:border-cream/10'}
    font-sans text-sm text-ink dark:text-cream
    placeholder:text-ink/30 dark:placeholder:text-cream/30
    focus:outline-none focus:border-forest-mid
    transition-colors duration-150
  `
}