import { motion } from 'framer-motion'

export default function PageWrapper({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex-1 min-w-0 p-6 lg:p-8"
    >
      {children}
    </motion.main>
  )
}