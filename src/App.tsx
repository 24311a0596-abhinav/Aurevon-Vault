import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Background from './components/Background';
import Landing from './pages/Landing';
import Vault from './pages/Vault';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setReady(true); }), []);
  return (
    <>
      <Background />
      {!ready ? <div className="min-h-screen grid place-items-center font-serif italic text-3xl text-primary/50">Aurevon</div>
        : user ? <Vault user={user} /> : <Landing />}
    </>
  );
}
