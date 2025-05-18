import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import './App.css';
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

  useEffect(() => {
    const auth = getAuth();
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
          <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            background: '#185a9d',
            color: 'white',
            zIndex: 1000,
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            fontWeight: 500
          }}>
            <Link to="/countries" style={{ color: 'white', textDecoration: 'none', fontSize: 18 }}>Maat</Link>
            <Link to="/visited" style={{ color: 'white', textDecoration: 'none', fontSize: 18 }}>Käydyt maat</Link>
            <Link to="/wishlist" style={{ color: 'white', textDecoration: 'none', fontSize: 18 }}>Toivelista</Link>
            <div className="nav-spacer" style={{ width: 32 }} />
            <button onClick={() => getAuth().signOut()} style={{ background: '#e74c3c', color: 'white', marginRight: 20 }}>Kirjaudu ulos</button>
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
