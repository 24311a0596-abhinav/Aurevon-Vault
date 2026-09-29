import { useEffect, useState } from 'react';
import { Flower2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = ['Home', 'Story', 'Collection', 'Inquire'];

export default function Navbar({ onEnter }: { onEnter: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(scrollY > 40); addEventListener('scroll', f); return () => removeEventListener('scroll', f); }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return (
    <>
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 left-0 w-full z-50 px-3 md:px-6">
        <div className={`glass mx-auto max-w-[1200px] h-14 md:h-16 rounded-full px-5 md:px-8 flex items-center justify-between transition-colors duration-500 ${scrolled ? 'bg-black/60' : ''}`}>
          <a href="#" className="text-primary text-xl md:text-2xl font-extrabold tracking-tight">Aurevon</a>
          <button onClick={() => setOpen(!open)} className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-sm text-primary/90 hover:bg-white/10">
            {open ? 'Close' : 'Navigate'}
          </button>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={onEnter} className="text-sm text-primary/80 hover:text-primary">Sign in</button>
            <Flower2 className="w-7 h-7 text-primary/90" />
          </div>
          <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="md:hidden text-primary">{open ? <X /> : <Menu />}</button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
            {LINKS.map((l, i) => (
              <motion.a key={l} href="#" onClick={() => setOpen(false)} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="font-serif italic text-primary text-4xl md:text-6xl hover:opacity-60">{l}</motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
