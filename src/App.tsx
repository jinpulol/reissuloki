import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import './Site.css';

const CountryList = lazy(() => import('./components/CountryList'));
const Register = lazy(() => import('./components/Register'));
const Login = lazy(() => import('./components/Login'));
const CountryDetail = lazy(() => import('./components/CountryDetail'));
const VisitedCountries = lazy(() => import('./components/VisitedCountries'));
const WishlistCountries = lazy(() => import('./components/WishlistCountries'));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // hampurilaisvalikon tila

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Sulje valikko reitityksen vaihtuessa
  useEffect(() => {
    setMenuOpen(false);
  }, [user]);

  if (!authChecked) {
    return <div style={{ minHeight: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Ladataan...</div>;
  }

  return (
    <BrowserRouter>
      {user ? (
        <>
          <nav className="main-nav">
            <button
              className="hamburger"
              aria-label={menuOpen ? 'Sulje valikko' : 'Avaa valikko'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: 28,
                cursor: 'pointer',
                display: 'none',
                marginRight: 12
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
            <div className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'}>
              <a href="/countries" style={{ color: 'white', textDecoration: 'none', fontSize: 18 }}>Maat</a>
              <a href="/visited" style={{ color: 'white', textDecoration: 'none', fontSize: 18 }}>Käydyt maat</a>
              <a href="/wishlist" style={{ color: 'white', textDecoration: 'none', fontSize: 18 }}>Toivelista</a>
              <div className="nav-spacer" style={{ width: 32 }} />
              <button onClick={() => auth.signOut()} style={{ background: '#e74c3c', color: 'white', marginRight: 20 }}>Kirjaudu ulos</button>
            </div>
          </nav>
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Suspense>
      )}
    </BrowserRouter>
  );
}

export default App;
