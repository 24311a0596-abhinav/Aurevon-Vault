import { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { LogOut, Plus } from 'lucide-react';
import { db } from '../lib/firebase';
import { logOut } from '../lib/authApi';
import { COLORS, Note, Subject } from '../lib/types';
import SubjectSidebar from '../components/SubjectSidebar';
import NoteEditor from '../components/NoteEditor';

export default function Vault({ user }: { user: User }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState('all');
  const [selId, setSelId] = useState<string | null>(null);
  const notesCol = collection(db, 'users', user.uid, 'documents');
  const subjCol = collection(db, 'users', user.uid, 'subjects');

  useEffect(() => onSnapshot(query(notesCol, orderBy('updatedAt', 'desc')), (s) =>
    setNotes(s.docs.map((d) => ({ id: d.id, title: d.data().title, body: d.data().body, subjectId: d.data().subjectId ?? null })))), [user.uid]);
  useEffect(() => onSnapshot(query(subjCol, orderBy('createdAt', 'asc')), (s) =>
    setSubjects(s.docs.map((d) => ({ id: d.id, name: d.data().name, color: d.data().color })))), [user.uid]);

  // Notes pointing at a deleted subject count as Unsorted.
  const known = useMemo(() => new Set(subjects.map((s) => s.id)), [subjects]);
  const all = useMemo(() => notes.map((n) => ({ ...n, subjectId: n.subjectId && known.has(n.subjectId) ? n.subjectId : null })), [notes, known]);
  const counts: Record<string, number> = { unsorted: 0 };
  all.forEach((n) => { const k = n.subjectId ?? 'unsorted'; counts[k] = (counts[k] || 0) + 1; });
  const visible = all.filter((n) => activeId === 'all' || (n.subjectId ?? 'unsorted') === activeId);
  const selected = all.find((n) => n.id === selId);
  const heading = activeId === 'all' ? 'All notes' : activeId === 'unsorted' ? 'Unsorted' : subjects.find((s) => s.id === activeId)?.name ?? '';

  const addSubject = (name: string) =>
    addDoc(subjCol, { name, color: COLORS[subjects.length % COLORS.length], createdAt: serverTimestamp() });
  const removeSubject = async (id: string) => {
    if (!confirm('Delete this subject? Its notes move to Unsorted.')) return;
    await Promise.all(notes.filter((n) => n.subjectId === id).map((n) => updateDoc(doc(notesCol, n.id), { subjectId: null })));
    await deleteDoc(doc(subjCol, id));
    if (activeId === id) setActiveId('all');
  };
  const createNote = async () => {
    const subjectId = subjects.some((s) => s.id === activeId) ? activeId : null;
    const r = await addDoc(notesCol, { title: 'Untitled', body: '', subjectId, updatedAt: serverTimestamp() });
    setSelId(r.id);
  };
  const saveNote = (id: string, patch: Partial<Pick<Note, 'title' | 'body' | 'subjectId'>>) =>
    updateDoc(doc(notesCol, id), { ...patch, updatedAt: serverTimestamp() });
  const removeNote = async (id: string) => {
    if (!confirm('Delete this note permanently?')) return;
    await deleteDoc(doc(notesCol, id)); setSelId(null);
  };

  return (
    <div className="min-h-screen p-3 md:p-6 flex flex-col gap-3">
      <header className="glass rounded-full px-6 h-14 flex items-center justify-between">
        <span className="text-primary text-xl font-extrabold tracking-tight">Aurevon <span className="font-serif italic font-normal text-primary/70">Vault</span></span>
        <button onClick={logOut} className="flex items-center gap-2 text-sm text-primary/80 hover:text-primary"><LogOut size={16} /> Sign out</button>
      </header>
      <div className="grid gap-3 flex-1 lg:grid-cols-[230px_300px_1fr]">
        <SubjectSidebar subjects={subjects} counts={counts} total={all.length} activeId={activeId}
          onSelect={(id) => { setActiveId(id); setSelId(null); }} onAdd={addSubject} onRemove={removeSubject} />
        <section className="glass rounded-3xl p-4 flex flex-col gap-2 lg:max-h-[calc(100vh-6.5rem)] overflow-y-auto">
          <div className="flex items-center justify-between px-2 pb-1">
            <h2 className="font-serif italic text-2xl text-primary truncate">{heading}</h2>
            <button onClick={createNote} aria-label="New note" className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-primary text-black"><Plus size={16} /></button>
          </div>
          {visible.length === 0 && <p className="text-sm text-gray-500 p-3">Nothing here yet. Add a note with the + button.</p>}
          {visible.map((n) => {
            const color = subjects.find((s) => s.id === n.subjectId)?.color;
            return (
              <button key={n.id} onClick={() => setSelId(n.id)}
                className={`text-left rounded-2xl px-4 py-3 border transition ${selId === n.id ? 'bg-white/10 border-primary/40' : 'border-transparent hover:bg-white/5'}`}>
                <p className="flex items-center gap-2 text-primary text-sm truncate">
                  {color && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />}{n.title}
                </p>
                <p className="text-gray-500 text-xs truncate">{n.body || 'Empty'}</p>
              </button>
            );
          })}
        </section>
        {selected
          ? <NoteEditor key={selected.id} note={selected} subjects={subjects} onSave={saveNote} onDelete={removeNote} />
          : <main className="glass rounded-3xl grid place-items-center min-h-[40vh]"><p className="font-serif italic text-3xl text-primary/40 text-center px-6">Select or create a note.</p></main>}
      </div>
    </div>
  );
}
