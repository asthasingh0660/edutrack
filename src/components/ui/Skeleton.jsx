export function SkeletonCard() {
  return (
    <div className="bg-cream-dark dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-5 w-16 rounded-pill" />
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="flex items-center justify-between pt-1">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-8 w-28 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonRing() {
  return (
    <div className="skeleton rounded-full" style={{ width: 120, height: 120 }} />
  )
}