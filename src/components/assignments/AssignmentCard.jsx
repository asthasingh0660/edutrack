import { motion } from 'framer-motion'
import { ExternalLink, Clock, CheckCircle2 } from 'lucide-react'
import Badge from '../ui/Badge'
import { getDeadlineLabel, formatSubmittedAt } from '../../utils/dates'

export default function AssignmentCard({ assignment, submission, onSubmit }) {
  const { title, subject, description, driveLink, dueDate, totalMarks, tags } = assignment
  const isSubmitted = !!submission
  const { label: deadlineLabel, level } = getDeadlineLabel(dueDate)

  const status = isSubmitted ? 'submitted' : level === 'overdue' ? 'overdue' : level === 'soon' ? 'soon' : 'pending'

  const deadlineColor = {
    overdue: 'text-coral',
    soon:    'text-gold-dark dark:text-gold',
    normal:  'text-ink/40 dark:text-cream/40',
  }[level] ?? 'text-ink/40'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={`
        relative overflow-hidden
        bg-cream border rounded-xl p-5
        dark:bg-cream/5
        transition-colors duration-200 group
        ${isSubmitted
          ? 'border-forest-mid/30 dark:border-forest-mid/20'
          : level === 'overdue'
            ? 'border-coral/25 dark:border-coral/20'
            : 'border-cream-border dark:border-cream/10 hover:border-forest-mid/40'
        }
      `}
    >
      {/* Left stripe */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl transition-all duration-200
        group-hover:w-[5px]
        ${isSubmitted ? 'bg-forest-mid' : level === 'overdue' ? 'bg-coral' : level === 'soon' ? 'bg-gold' : 'bg-cream-border dark:bg-cream/15'}
      `} />

      <div className="pl-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="font-sans font-medium text-sm text-ink dark:text-cream leading-snug mb-0.5 truncate pr-2">
              {title}
            </p>
            <span className="font-mono text-[10px] text-ink/40 dark:text-cream/60 tracking-wide">{subject}</span>
          </div>
          <Badge status={status} />
        </div>

        {/* Description */}
        <p className="font-sans text-xs text-ink/50 dark:text-cream/60 leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-cream-dark dark:bg-cream/15 text-ink/40 dark:text-cream/70 border border-cream-border dark:border-cream/20">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {isSubmitted
              ? <CheckCircle2 size={13} strokeWidth={1.5} className="text-forest-mid" />
              : <Clock size={13} strokeWidth={1.5} className={deadlineColor} />
            }
            <span className={`font-mono text-[11px] ${isSubmitted ? 'text-forest-mid' : deadlineColor}`}>
              {isSubmitted && submission
                ? formatSubmittedAt(submission.submittedAt)
                : deadlineLabel}
            </span>
            <span className="font-mono text-[11px] text-ink/25 dark:text-cream/50 ml-2">
              {totalMarks} marks
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Drive link */}
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[11px] text-ink/40 dark:text-cream/50 hover:text-forest-mid transition-colors"
              aria-label="Open Drive link"
            >
              <ExternalLink size={12} strokeWidth={1.5} />
              Drive
            </a>

            {/* Submit CTA */}
            {!isSubmitted && (
              <button
                onClick={() => onSubmit(assignment)}
                className="
                  font-sans text-xs font-medium
                  px-3 py-1.5 rounded-lg
                  bg-ink text-cream dark:bg-cream dark:text-ink
                  hover:bg-forest dark:hover:bg-forest-mid
                  transition-colors duration-150
                "
              >
                Mark Submitted
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}