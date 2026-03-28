import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { formatDeadline } from '../../utils/dates'

export default function UrgentBanner({ assignments }) {
  if (!assignments.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-coral-pale border border-coral/20 rounded-xl px-4 py-3 flex items-start gap-3"
    >
      <AlertCircle size={16} strokeWidth={1.5} className="text-coral mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-coral mb-0.5">
          {assignments.length === 1
            ? '1 assignment due within 24 hours'
            : `${assignments.length} assignments due within 24 hours`}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5">
          {assignments.map((a) => (
            <span key={a.id} className="font-mono text-[11px] text-coral/70">
              {a.title} · {formatDeadline(a.dueDate)}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}