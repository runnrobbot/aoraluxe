import { motion, type Variants } from 'framer-motion';

interface HeroSectionProps {
  onExplore: () => void;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: 'easeOut' as const } },
};

const HeroSection = ({ onExplore }: HeroSectionProps) => (
  <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-stone-900">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#c9a84c 1px, transparent 1px), linear-gradient(to right, #c9a84c 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>

    {/* Decorative rings */}
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <div className="w-[520px] h-[520px] rounded-full border border-gold/5" />
      <div className="absolute inset-[65px] rounded-full border border-gold/10" />
      <div className="absolute inset-[130px] rounded-full border border-gold/15" />
    </motion.div>

    {/* Floating gold orbs */}
    <motion.div
      animate={{ y: [0, -18, 0], opacity: [0.15, 0.3, 0.15] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-gold/30 hidden lg:block"
    />
    <motion.div
      animate={{ y: [0, 14, 0], opacity: [0.1, 0.25, 0.1] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      className="absolute bottom-[30%] right-[18%] w-1.5 h-1.5 rounded-full bg-gold/20 hidden lg:block"
    />
    <motion.div
      animate={{ y: [0, -10, 0], opacity: [0.08, 0.2, 0.08] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute top-[40%] right-[10%] w-1 h-1 rounded-full bg-gold/20 hidden lg:block"
    />

    {/* Content */}
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative text-center text-white px-4 max-w-3xl mx-auto"
    >
      <motion.p variants={fadeUp} className="text-[0.65rem] tracking-[0.7em] uppercase mb-6 font-light" style={{ color: '#c9a84c' }}>
        Koleksi Eksklusif
      </motion.p>

      <div className="overflow-hidden mb-0">
        <motion.h1
          variants={fadeUp}
          className="font-serif font-light tracking-[0.15em] text-white leading-[1.1]"
          style={{ fontSize: 'clamp(3.2rem, 9vw, 6.5rem)' }}
        >
          AORA
        </motion.h1>
      </div>
      <div className="overflow-hidden mb-8">
        <motion.h1
          variants={fadeUp}
          className="font-serif italic font-light tracking-[0.15em] leading-[1.1]"
          style={{ fontSize: 'clamp(3.2rem, 9vw, 6.5rem)', color: '#c9a84c' }}
        >
          LUXE
        </motion.h1>
      </div>

      <motion.p variants={fadeUp} className="text-zinc-400 text-[0.7rem] md:text-xs tracking-[0.4em] uppercase mb-10 font-light max-w-xs mx-auto leading-loose">
        People will stare. Make it worth their while.
      </motion.p>

      <motion.div variants={fadeUp}>
        <motion.button
          onClick={onExplore}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex items-center gap-3 px-8 py-3.5 border border-gold/40 text-gold text-[0.65rem] tracking-[0.35em] uppercase hover:bg-gold hover:text-zinc-900 transition-all duration-300"
        >
          <span>Jelajahi Koleksi</span>
          <motion.svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </motion.svg>
        </motion.button>
      </motion.div>
    </motion.div>

    {/* Scroll indicator */}
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      transition={{ delay: 1.4 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="text-white/30 text-[0.55rem] tracking-[0.5em] uppercase">Scroll</span>
      <motion.div
        animate={{ scaleY: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent origin-top"
      />
    </motion.div>
  </section>
);

export default HeroSection;
