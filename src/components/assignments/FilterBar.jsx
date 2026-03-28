const statusOptions = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'overdue',   label: 'Overdue' },
]
const subjectOptions = [
  { value: 'all',        label: 'All Subjects' },
  { value: 'Maths',      label: 'Maths' },
  { value: 'Physics',    label: 'Physics' },
  { value: 'Literature', label: 'Literature' },
]

export default function FilterBar({ statusFilter, setStatusFilter, subjectFilter, setSubjectFilter }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Status pills */}
      <div className="flex gap-1.5 flex-wrap">
        {statusOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`
              font-mono text-[10px] tracking-wide px-3 py-1 rounded-pill border transition-all duration-150
              ${statusFilter === value
                ? 'bg-ink text-cream border-ink dark:bg-cream dark:text-ink dark:border-cream'
                : 'bg-transparent text-ink/50 dark:text-cream/50 border-cream-border dark:border-cream/15 hover:border-ink/30 dark:hover:border-cream/30'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-cream-border dark:bg-cream/15 mx-1" />

      {/* Subject pills */}
      <div className="flex gap-1.5 flex-wrap">
        {subjectOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSubjectFilter(value)}
            className={`
              font-mono text-[10px] tracking-wide px-3 py-1 rounded-pill border transition-all duration-150
              ${subjectFilter === value
                ? 'bg-forest text-cream border-forest'
                : 'bg-transparent text-ink/50 dark:text-cream/50 border-cream-border dark:border-cream/15 hover:border-forest/40'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}