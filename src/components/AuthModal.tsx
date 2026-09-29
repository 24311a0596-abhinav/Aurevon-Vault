import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { logIn, resetPassword, signUp } from '../lib/authApi';

const field = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/40 focus:border-primary/60 outline-none';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [f, setF] = useState({ accountId: '', email: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
    const [info, setInfo] = useState('');
  const forgot = async () => {
    setErr(''); setInfo('');
    if (!f.accountId.trim()) return setErr('Enter your Account ID or email above first.');
    try { await resetPassword(f.accountId); setInfo('Reset link sent. Check your inbox and spam folder.'); }
    catch (x) { setErr(x instanceof Error ? x.message.replace('Firebase: ', '') : 'Something went wrong.'); }
  };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (mode === 'signup') await signUp(f.accountId, f.email, f.password);
      else await logIn(f.accountId, f.password);
    } catch (x) { setErr(x instanceof Error ? x.message.replace('Firebase: ', '') : 'Something went wrong.'); }
    setBusy(false);
  };

  return (
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.form onSubmit={submit} onClick={(e) => e.stopPropagation()} initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="glass w-full max-w-md rounded-3xl p-8 space-y-4 relative">
        <button type="button" aria-label="Close" onClick={onClose} className="absolute top-5 right-5 text-primary/60 hover:text-primary"><X size={18} /></button>
        <h2 className="font-serif italic text-4xl text-primary">{mode === 'signup' ? 'Open your vault' : 'Welcome back'}</h2>
        <input className={field} placeholder={mode === 'signup' ? 'Choose an Account ID' : 'Account ID or email'} value={f.accountId} onChange={set('accountId')} required />
        {mode === 'signup' && <input className={field} type="email" placeholder="Email" value={f.email} onChange={set('email')} required />}
        <input className={field} type="password" minLength={6} placeholder="Password (6+ characters)" value={f.password} onChange={set('password')} required />
        {err && <p role="alert" className="text-sm text-red-300/90">{err}</p>}
        {info && <p className="text-sm text-primary/80">{info}</p>}
        <button disabled={busy} className="w-full py-3 rounded-full bg-primary text-black font-bold hover:bg-primary/90 disabled:opacity-50">
          {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Enter the vault'}
        </button>
        {mode === 'login' && (
          <button type="button" onClick={forgot} className="w-full text-xs text-primary/60 hover:text-primary">Forgot password?</button>
        )}
        <button type="button" onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setErr(''); setInfo(''); }} className="w-full text-xs text-primary/60 hover:text-primary">
          {mode === 'signup' ? 'Have an account? Sign in' : 'New here? Create an account'}
        </button>
      </motion.form>
    </motion.div>
  );
}
