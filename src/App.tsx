import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import './App.css';
import './Site.css';
import CountryList from './components/CountryList';
import Register from './components/Register';
import Login from './components/Login';
import CountryDetail from './components/CountryDetail';
import VisitedCountries from './components/VisitedCountries';
import WishlistCountries from './components/WishlistCountries';

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
    return <div>Ladataan...</div>;
  }

  return (
    <BrowserRouter>
      {user ? (
        <>
          <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f0f0f0' }}>
            <Link to="/countries">Maat</Link>
            <Link to="/visited">Käydyt maat</Link>
            <Link to="/wishlist">Toivelista</Link>
            <button onClick={() => getAuth().signOut()}>Kirjaudu ulos</button>
          </nav>
          <Routes>
            <Route path="/countries" element={<CountryList />} />
            <Route path="/country/:cca3" element={<CountryDetail />} />
            <Route path="/visited" element={<VisitedCountries />} />
            <Route path="/wishlist" element={<WishlistCountries />} />
            <Route path="*" element={<CountryList />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
