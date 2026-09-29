import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, HardDrive, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import WordsPullUp from '../components/WordsPullUp';

const VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260819_212700_3bb9329b-5c50-4257-a09b-ca85cf3654a3.mp4';
const ease = [0.16, 1, 0.3, 1] as const;
const FEATURES = [
  { Icon: Lock, t: 'Yours alone', d: 'Every document lives under your own account. No one else can open it.' },
  { Icon: FileText, t: 'Write freely', d: 'Notes and markdown, editable any time.' },
  { Icon: HardDrive, t: 'Always with you', d: 'Sign in on any device and pick up exactly where you stopped.' },
];

export default function Landing() {
  const [auth, setAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div className="relative">
      <Navbar onEnter={() => setAuth(true)} />
      <section className="relative h-screen overflow-hidden flex items-end justify-center">
        <div className={`absolute inset-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${mounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}>
          <video src={VIDEO} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>
        <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
          <h1 className="font-serif text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl text-white mb-5 md:mb-6">
            <WordsPullUp text="Everything worth keeping, kept beautifully." />
          </h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.9, ease }} className="text-white/70 md:text-lg mb-8 max-w-md mx-auto">
            A private vault for your notes and documents, protected by your own account.
          </motion.p>
          <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1, duration: 0.9, ease }}
            onClick={() => setAuth(true)} className="group inline-flex items-center gap-3 pl-8 pr-2 py-2 bg-primary text-black font-bold rounded-full hover:gap-4 transition-all shadow-[0_0_40px_rgba(222,219,200,.25)]">
            Enter the Vault
            <span className="bg-black rounded-full w-10 h-10 grid place-items-center group-hover:scale-110 transition"><ArrowRight className="text-primary" size={18} /></span>
          </motion.button>
        </div>
      </section>
      <section className="px-4 md:px-8 py-24 max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-center mb-14"><WordsPullUp text="Built for people who keep their thoughts close." /></h2>
        <div className="grid md:grid-cols-3 gap-3">
          {FEATURES.map(({ Icon, t, d }, i) => (
            <motion.div key={t} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: i * 0.15, duration: 0.8, ease }} className="glass rounded-3xl p-8 min-h-[240px] flex flex-col justify-between">
              <Icon className="text-primary" />
              <div><h3 className="text-2xl text-primary mb-2">{t}</h3><p className="text-gray-400 text-sm leading-snug">{d}</p></div>
            </motion.div>
          ))}
        </div>
      </section>
      {auth && <AuthModal onClose={() => setAuth(false)} />}
    </div>
  );
}
