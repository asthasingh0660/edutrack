import { CheckCircle2, Clock } from 'lucide-react'
import { formatSubmittedAt, formatDeadline, isOverdue } from '../../utils/dates'

export default function StudentRow({ student, submission, dueDate }) {
  const isSubmitted = !!submission
  const overdue = !isSubmitted && isOverdue(dueDate)

  return (
    <div className="flex items-center gap-3 py-3 border-b border-cream-border dark:border-cream/10 last:border-0">
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-medium flex-shrink-0
        ${isSubmitted
          ? 'bg-forest-light text-forest dark:bg-forest/20 dark:text-forest-mid'
          : 'bg-cream-dark dark:bg-cream/10 text-ink/50 dark:text-cream/50'
        }
      `}>
        {student.avatar}
      </div>

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-ink dark:text-cream truncate">
          {student.name}
        </p>
        <p className="font-mono text-[10px] text-ink/40 dark:text-cream/60 truncate">
          {student.email}
        </p>
      </div>

      {/* Status pill */}
      <div className={`
        flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-pill border
        ${isSubmitted
          ? 'bg-forest-pale dark:bg-forest/10 border-forest-mid/30 dark:border-forest-mid/20'
          : overdue
            ? 'bg-coral-pale dark:bg-coral/10 border-coral/20'
            : 'bg-cream-dark dark:bg-cream/8 border-cream-border dark:border-cream/15'
        }
      `}>
        {isSubmitted ? (
          <>
            <CheckCircle2 size={11} strokeWidth={1.5} className="text-forest-mid" />
            <span className="font-mono text-[10px] text-forest-mid whitespace-nowrap">
              {formatSubmittedAt(submission.submittedAt)}
            </span>
          </>
        ) : (
          <>
            <Clock size={11} strokeWidth={1.5} className={overdue ? 'text-coral' : 'text-ink/40 dark:text-cream/40'} />
            <span className={`font-mono text-[10px] whitespace-nowrap ${overdue ? 'text-coral' : 'text-ink/40 dark:text-cream/70'}`}>
              {formatDeadline(dueDate)}
            </span>
          </>
        )}
      </div>
    </div>
  )
}