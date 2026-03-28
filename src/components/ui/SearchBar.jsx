import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search assignments…' }) {
  return (
    <div className="relative flex items-center">
      <Search
        size={15} strokeWidth={1.5}
        className="absolute left-3 text-ink/30 dark:text-cream/55 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-8 py-2.5 rounded-xl
          bg-cream-dark dark:bg-ink/55
          border border-cream-border dark:border-cream/20
          font-sans text-sm text-ink dark:text-cream/90
          placeholder:text-ink/30 dark:placeholder:text-cream/50
          focus:outline-none focus:border-forest-mid dark:focus:border-forest-mid dark:focus:bg-ink/65
          transition-colors duration-150
        "
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 text-ink/30 dark:text-cream/60 hover:text-ink dark:hover:text-cream transition-colors"
          aria-label="Clear search"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}