import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface CountryComment {
  id?: string;
  countryCca3: string;
  userId: string;
  userEmail: string;
  text: string;
  createdAt: Timestamp;
}

const COMMENTS_COLLECTION = 'countryComments';

export const addComment = async (countryCca3: string, text: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Kirjautuminen vaaditaan');
  await addDoc(collection(db, COMMENTS_COLLECTION), {
    countryCca3,
    userId: user.uid,
    userEmail: user.email || '',
    text,
    createdAt: Timestamp.now(),
  });
};

export const getComments = async (countryCca3: string): Promise<CountryComment[]> => {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('countryCca3', '==', countryCca3),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as CountryComment));
};

export const updateComment = async (commentId: string, newText: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Kirjautuminen vaaditaan');
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  await updateDoc(commentRef, { text: newText });
};

export const deleteComment = async (commentId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Kirjautuminen vaaditaan');
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  await deleteDoc(commentRef);
};
