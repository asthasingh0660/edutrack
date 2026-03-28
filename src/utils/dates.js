import { formatDistanceToNow, isPast, differenceInHours } from 'date-fns'

export function isOverdue(dateStr) {
  return isPast(new Date(dateStr))
}

export function isDueSoon(dateStr) {
  const hours = differenceInHours(new Date(dateStr), new Date())
  return hours > 0 && hours <= 48
}

export function formatDeadline(dateStr) {
  const date = new Date(dateStr)
  if (isPast(date)) return 'Overdue'
  return `Due ${formatDistanceToNow(date, { addSuffix: true })}`
}

export function formatSubmittedAt(dateStr) {
  return `Submitted ${formatDistanceToNow(new Date(dateStr), { addSuffix: true })}`
}

export function getDeadlineLabel(dateStr) {
  if (isOverdue(dateStr)) return { label: 'Overdue', level: 'overdue' }
  if (isDueSoon(dateStr)) return { label: formatDeadline(dateStr), level: 'soon' }
  return { label: formatDeadline(dateStr), level: 'normal' }
}