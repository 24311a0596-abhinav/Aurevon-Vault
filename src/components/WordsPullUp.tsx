import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function WordsPullUp({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="overflow-hidden inline-block pb-[0.08em] mr-[0.25em]">
          <motion.span className="inline-block" initial={{ y: '100%', opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>{w}</motion.span>
        </span>
      ))}
    </span>
  );
}
