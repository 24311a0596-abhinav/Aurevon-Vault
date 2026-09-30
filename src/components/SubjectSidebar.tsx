import { ReactNode, useState } from 'react';
import { Inbox, Layers, Plus, X } from 'lucide-react';
import { Subject } from '../lib/types';

interface Props {
  subjects: Subject[]; counts: Record<string, number>; total: number; activeId: string;
  onSelect: (id: string) => void; onAdd: (name: string) => void; onRemove: (id: string) => void;
}

export default function SubjectSidebar({ subjects, counts, total, activeId, onSelect, onAdd, onRemove }: Props) {
  const [name, setName] = useState('');
  const row = (id: string, label: string, count: number, icon: ReactNode, removable = false) => (
    <div key={id} className={`group flex items-center rounded-xl border transition ${activeId === id ? 'bg-white/10 border-primary/40' : 'border-transparent hover:bg-white/5'}`}>
      <button onClick={() => onSelect(id)} className="flex-1 min-w-0 flex items-center gap-3 px-3 py-2.5 text-left">
        {icon}<span className="truncate text-sm text-primary">{label}</span>
        <span className="ml-auto text-xs text-gray-500">{count}</span>
      </button>
      {removable && (
        <button aria-label={`Delete ${label}`} onClick={() => onRemove(id)} className="px-2 text-gray-500 hover:text-primary opacity-0 group-hover:opacity-100 focus:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
  return (
    <aside className="glass rounded-3xl p-4 flex flex-col gap-1 lg:max-h-[calc(100vh-6.5rem)] overflow-y-auto">
      <p className="px-3 pb-1 text-xs text-gray-500">Subjects</p>
      {row('all', 'All notes', total, <Layers size={15} className="text-primary/70 shrink-0" />)}
      {subjects.map((s) => row(s.id, s.name, counts[s.id] || 0, <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />, true))}
      {row('unsorted', 'Unsorted', counts.unsorted || 0, <Inbox size={15} className="text-primary/70 shrink-0" />)}
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { onAdd(name.trim()); setName(''); } }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New subject" maxLength={40}
          className="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-primary placeholder:text-primary/40 outline-none focus:border-primary/60" />
        <button aria-label="Add subject" className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-primary text-black"><Plus size={16} /></button>
      </form>
    </aside>
  );
}