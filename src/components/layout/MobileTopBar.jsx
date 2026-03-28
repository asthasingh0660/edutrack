import { Menu } from 'lucide-react'

export default function MobileTopBar({ title, setMobileOpen }) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-cream dark:bg-[#1C1C14] border-b border-cream-border dark:border-cream/10 px-4 py-3 flex items-center gap-3">
      <button
        onClick={() => setMobileOpen(true)}
        className="text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>
      <h1 className="font-serif text-lg text-ink dark:text-cream">{title}</h1>
    </header>
  )
}