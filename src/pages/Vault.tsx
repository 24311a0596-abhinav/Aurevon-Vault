import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Trash2, Save } from 'lucide-react';
import { db } from '../lib/firebase';
import { logOut } from '../lib/authApi';

interface Note { id: string; title: string; body: string }

export default function Vault({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [title, setTitle] = useState(''); const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const col = collection(db, 'users', user.uid, 'documents');

  useEffect(() => onSnapshot(query(col, orderBy('updatedAt', 'desc')), (s) =>
    setNotes(s.docs.map((d) => ({ id: d.id, title: d.data().title, body: d.data().body })))), [user.uid]);

  const open = (n: Note) => { setSel(n.id); setTitle(n.title); setBody(n.body); setStatus(''); };
  const create = async () => {
    const r = await addDoc(col, { title: 'Untitled', body: '', updatedAt: serverTimestamp() });
    open({ id: r.id, title: 'Untitled', body: '' });
  };
  const save = async () => {
    if (!sel) return;
    await updateDoc(doc(col, sel), { title: title || 'Untitled', body, updatedAt: serverTimestamp() });
    setStatus('Saved');
  };
  const remove = async () => {
    if (!sel || !confirm('Delete this document permanently?')) return;
    await deleteDoc(doc(col, sel)); setSel(null); setTitle(''); setBody('');
  };

  return (
    <div className="min-h-screen p-3 md:p-6 flex flex-col gap-3">
      <header className="glass rounded-full px-6 h-14 flex items-center justify-between">
        <span className="text-primary text-xl font-extrabold tracking-tight">Aurevon <span className="font-serif italic font-normal text-primary/70">Vault</span></span>
        <button onClick={logOut} className="flex items-center gap-2 text-sm text-primary/80 hover:text-primary"><LogOut size={16} /> Sign out</button>
      </header>
      <div className="grid md:grid-cols-[300px_1fr] gap-3 flex-1">
        <aside className="glass rounded-3xl p-4 flex flex-col gap-2 md:max-h-[calc(100vh-6.5rem)] overflow-y-auto">
          <button onClick={create} className="flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-black font-bold text-sm hover:bg-primary/90"><Plus size={16} /> New document</button>
          {notes.length === 0 && <p className="text-sm text-gray-500 p-3">Your vault is empty. Create your first document to begin.</p>}
          <AnimatePresence initial={false}>
            {notes.map((n) => (
              <motion.button key={n.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => open(n)}
                className={`text-left rounded-2xl px-4 py-3 border transition ${sel === n.id ? 'bg-white/10 border-primary/40' : 'border-transparent hover:bg-white/5'}`}>
                <p className="text-primary text-sm truncate">{n.title}</p>
                <p className="text-gray-500 text-xs truncate">{n.body || 'Empty'}</p>
              </motion.button>
            ))}
          </AnimatePresence>
        </aside>
        <main className="glass rounded-3xl p-5 md:p-8 flex flex-col gap-4 min-h-[60vh]">
          {sel ? (<>
            <input value={title} onChange={(e) => { setTitle(e.target.value); setStatus(''); }} placeholder="Title" className="bg-transparent font-serif italic text-4xl md:text-5xl text-primary outline-none placeholder:text-primary/30" />
            <textarea value={body} onChange={(e) => { setBody(e.target.value); setStatus(''); }} placeholder="Write in markdown or plain text…" className="flex-1 min-h-[40vh] bg-transparent resize-none outline-none text-primary/90 leading-relaxed" />
            <div className="flex items-center gap-3 justify-end">
              <span className="text-xs text-gray-500">{status}</span>
              <button onClick={remove} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm text-primary/80 hover:bg-white/10"><Trash2 size={15} /> Delete</button>
              <button onClick={save} className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-black text-sm font-bold"><Save size={15} /> Save</button>
            </div>
          </>) : <p className="m-auto font-serif italic text-3xl text-primary/40 text-center">Select or create a document.</p>}
        </main>
      </div>
    </div>
  );
}
