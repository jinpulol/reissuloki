import { db, auth } from '../firebaseConfig';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';

export interface UserCountryListItem {
  id?: string; // Firestore document ID
  userId: string;
  countryCca3: string; // Maan tunniste
  countryName: string; // Maan nimi (helpottaa näyttämistä listoissa)
  countryFlagSvg: string; // Lipun SVG URL (helpottaa näyttämistä listoissa)
  listType: 'visited' | 'wantToVisit';
  addedAt: Timestamp;
  notes?: string;
}

const USER_LISTS_COLLECTION = 'userCountryLists';

// Lisää maa käyttäjän listalle
export const addCountryToUserList = async (
  item: Omit<UserCountryListItem, 'id' | 'userId' | 'addedAt'>
): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Käyttäjä ei ole kirjautunut sisään.");
    // Voit heittää virheen tai palauttaa nullin ja käsitellä sen käyttöliittymässä
    throw new Error("Toiminto vaatii kirjautumisen.");
  }
  try {
    const docRef = await addDoc(collection(db, USER_LISTS_COLLECTION), {
      ...item,
      userId: user.uid,
      addedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Virhe lisättäessä maata listalle: ", error);
    throw error; // Heitä virhe eteenpäin käsiteltäväksi
  }
};

// Hae käyttäjän maat tietyltä listalta
export const getUserCountryList = async (listType: 'visited' | 'wantToVisit'): Promise<UserCountryListItem[]> => {
  const user = auth.currentUser;
  if (!user) {
    return []; // Palauta tyhjä lista, jos käyttäjä ei ole kirjautunut
  }
  const q = query(
    collection(db, USER_LISTS_COLLECTION),
    where('userId', '==', user.uid),
    where('listType', '==', listType),
    orderBy('addedAt', 'desc') // Uusimmat ensin
  );
  const querySnapshot = await getDocs(q);
  const list: UserCountryListItem[] = [];
  querySnapshot.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() } as UserCountryListItem);
  });
  return list;
};

// Poista maa käyttäjän listalta dokumentin ID:n perusteella
export const removeCountryFromUserList = async (docId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Toiminto vaatii kirjautumisen.");
  }
  // Varmistus: Firestore-säännöillä tulisi myös estää luvaton poisto.
  // Tässä voisi halutessaan ensin hakea dokumentin ja varmistaa sen omistajuuden.
  const docRef = doc(db, USER_LISTS_COLLECTION, docId);
  await deleteDoc(docRef);
};

// Päivitä maan muistiinpanot listalla
export const updateNotesForCountryInList = async (docId: string, notes: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Toiminto vaatii kirjautumisen.");
  }
  const docRef = doc(db, USER_LISTS_COLLECTION, docId);
  await setDoc(docRef, { notes }, { merge: true }); // merge:true päivittää vain notes-kentän
};

// Tarkista, onko maa jo käyttäjän listalla
export const isCountryInUserList = async (countryCca3: string, listType: 'visited' | 'wantToVisit'): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;

    const q = query(
        collection(db, USER_LISTS_COLLECTION),
        where('userId', '==', user.uid),
        where('countryCca3', '==', countryCca3),
        where('listType', '==', listType),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};