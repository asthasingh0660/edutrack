export default function Badge({ status }) {
  const styles = {
    submitted: 'bg-forest-light text-forest border border-forest-mid/30',
    pending:   'bg-gold-pale text-gold-dark border border-gold/40',
    overdue:   'bg-coral-pale text-coral border border-coral/30',
    soon:      'bg-gold-pale text-gold-dark border border-gold/40',
  }
  const labels = {
    submitted: 'Submitted',
    pending:   'Pending',
    overdue:   'Overdue',
    soon:      'Due Soon',
  }
  return (
    <span className={`inline-flex items-center font-mono text-[10px] tracking-wide px-2.5 py-0.5 rounded-pill transition-all duration-300 ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? 'Pending'}
    </span>
  )
}