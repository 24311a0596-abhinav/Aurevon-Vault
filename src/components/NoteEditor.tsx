import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { Note, Subject } from '../lib/types';

interface Props {
  note: Note; subjects: Subject[];
  onSave: (id: string, patch: Partial<Pick<Note, 'title' | 'body' | 'subjectId'>>) => Promise<void>;
  onDelete: (id: string) => void;
}

export default function NoteEditor({ note, subjects, onSave, onDelete }: Props) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [status, setStatus] = useState('');
  const save = async () => { await onSave(note.id, { title: title || 'Untitled', body }); setStatus('Saved'); };
  return (
    <main className="glass rounded-3xl p-5 md:p-8 flex flex-col gap-4 min-h-[60vh]">
      <select value={note.subjectId ?? ''} onChange={(e) => onSave(note.id, { subjectId: e.target.value || null })} aria-label="Subject"
        className="self-start bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-primary outline-none">
        <option value="" className="bg-black">Unsorted</option>
        {subjects.map((s) => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
      </select>
      <input value={title} onChange={(e) => { setTitle(e.target.value); setStatus(''); }} placeholder="Title"
        className="bg-transparent font-serif italic text-4xl md:text-5xl text-primary outline-none placeholder:text-primary/30" />
      <textarea value={body} onChange={(e) => { setBody(e.target.value); setStatus(''); }} placeholder="Write in markdown or plain text…"
        className="flex-1 min-h-[40vh] bg-transparent resize-none outline-none text-primary/90 leading-relaxed" />
      <div className="flex items-center gap-3 justify-end">
        <span className="text-xs text-gray-500">{status}</span>
        <button onClick={() => onDelete(note.id)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm text-primary/80 hover:bg-white/10"><Trash2 size={15} /> Delete</button>
        <button onClick={save} className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-black text-sm font-bold"><Save size={15} /> Save</button>
      </div>
    </main>
  );
}
