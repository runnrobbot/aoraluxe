import { motion } from 'framer-motion';

const CATEGORIES = ['Semua', 'Sale', 'Premium', 'Semi Mirror', 'Mirror', 'No Brand'];

const CategoryFilter = ({ selected, onSelect }) => (
  <div className="flex items-center gap-2 flex-wrap">
    {CATEGORIES.map((cat) => (
      <motion.button
        key={cat}
        onClick={() => onSelect(cat)}
        whileTap={{ scale: 0.95 }}
        className={`relative px-4 py-1.5 text-[0.65rem] tracking-widest uppercase transition-all duration-200 border ${
          selected === cat
            ? 'bg-zinc-900 text-white border-zinc-900'
            : 'bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800'
        }`}
      >
        {cat}
        {selected === cat && (
          <motion.span
            layoutId="cat-indicator"
            className="absolute inset-0 bg-zinc-900 -z-10"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          />
        )}
      </motion.button>
    ))}
  </div>
);

export default CategoryFilter;
