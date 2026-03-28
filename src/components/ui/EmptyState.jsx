import { motion } from 'framer-motion'

const messages = {
  all:       { heading: 'All clear!', sub: 'No assignments here — enjoy the quiet.' },
  submitted: { heading: 'Nothing submitted yet.', sub: 'Mark an assignment done to see it here.' },
  pending:   { heading: 'Nothing pending.', sub: 'You\'re completely caught up.' },
  overdue:   { heading: 'No overdue work.', sub: 'Great — keep that streak going.' },
  search:    { heading: 'No results.', sub: 'Try a different keyword or clear the filter.' },
}

export default function EmptyState({ variant = 'all' }) {
  const { heading, sub } = messages[variant] ?? messages.all
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <p className="font-serif text-xl italic text-ink/40 dark:text-cream/30 mb-1">{heading}</p>
      <p className="font-sans text-sm text-ink/30 dark:text-cream/25">{sub}</p>
    </motion.div>
  )
}