import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { sendWelcomeEmail } from './email';

const ID_RE = /^[a-zA-Z0-9_-]{3,24}$/;

export async function signUp(accountId: string, email: string, password: string) {
  const id = accountId.trim().toLowerCase();
  if (!ID_RE.test(id)) throw new Error('Account ID: 3–24 letters, numbers, - or _.');
  if ((await getDoc(doc(db, 'accounts', id))).exists()) throw new Error('That Account ID is taken.');
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await setDoc(doc(db, 'accounts', id), { email: email.trim(), uid: user.uid });
  await setDoc(doc(db, 'users', user.uid), { accountId: id, email: email.trim(), createdAt: serverTimestamp() });
  sendWelcomeEmail(email.trim(), id).catch(console.warn); // non-blocking
}

/** identifier = Account ID or Email */
export async function logIn(identifier: string, password: string) {
  let email = identifier.trim();
  if (!email.includes('@')) {
    const snap = await getDoc(doc(db, 'accounts', email.toLowerCase()));
    if (!snap.exists()) throw new Error('No account found for that ID.');
    email = snap.data().email as string;
  }
  await signInWithEmailAndPassword(auth, email, password);
}
export const logOut = () => signOut(auth);
/** identifier = Account ID or Email */
export async function resetPassword(identifier: string) {
  let email = identifier.trim();
  if (!email.includes('@')) {
    const snap = await getDoc(doc(db, 'accounts', email.toLowerCase()));
    if (!snap.exists()) throw new Error('No account found for that ID.');
    email = snap.data().email as string;
  }
  await sendPasswordResetEmail(auth, email);
}
