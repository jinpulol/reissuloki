import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import './Site.css';
import Navbar from './components/Navbar';

const CountryList = lazy(() => import('./components/CountryList'));
const Register = lazy(() => import('./components/Register'));
const Login = lazy(() => import('./components/Login'));
const CountryDetail = lazy(() => import('./components/CountryDetail'));
const VisitedCountries = lazy(() => import('./components/VisitedCountries'));
const WishlistCountries = lazy(() => import('./components/WishlistCountries'));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <div style={{ minHeight: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ladataan...</div>;
  }

  return (
    <BrowserRouter>
      {user ? (
        <>
          <Navbar onLogout={() => auth.signOut()} />
          <div style={{ height: 68 }} />
          <Suspense fallback={<div style={{ minHeight: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ladataan...</div>}>
            <Routes>
              <Route path="/countries" element={<CountryList />} />
              <Route path="/country/:cca3" element={<CountryDetail />} />
              <Route path="/visited" element={<VisitedCountries />} />
              <Route path="/wishlist" element={<WishlistCountries />} />
              <Route path="*" element={<CountryList />} />
            </Routes>
          </Suspense>
        </>
      ) : (
        <Suspense fallback={<div style={{ minHeight: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ladataan...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Suspense>
      )}
    </BrowserRouter>
  );
}

export default App;
