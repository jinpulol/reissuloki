import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export const getUserDocRef = (user: User) => doc(db, 'users', user.uid);

export const addCountryToList = async (user: User, listName: 'visited' | 'wishlist', cca3: string) => {
  const userRef = getUserDocRef(user);
  await setDoc(userRef, { [listName]: arrayUnion(cca3) }, { merge: true });
};

export const removeCountryFromList = async (user: User, listName: 'visited' | 'wishlist', cca3: string) => {
  const userRef = getUserDocRef(user);
  await updateDoc(userRef, { [listName]: arrayRemove(cca3) });
};

export const getUserCountryLists = async (user: User) => {
  const userRef = getUserDocRef(user);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return { visited: [], wishlist: [] };
  const data = snap.data();
  return {
    visited: data.visited || [],
    wishlist: data.wishlist || []
  };
};

export const setCountryNote = async (user: User, cca3: string, note: string) => {
  const userRef = getUserDocRef(user);
  await setDoc(userRef, { notes: { [cca3]: note } }, { merge: true });
};

export const getCountryNote = async (user: User, cca3: string) => {
  const userRef = getUserDocRef(user);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return '';
  const data = snap.data();
  return data.notes?.[cca3] || '';
};
