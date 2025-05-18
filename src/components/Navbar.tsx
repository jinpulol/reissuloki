import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => (
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
    <button onClick={onLogout} style={{ background: '#e74c3c', color: 'white', marginRight: 20 }}>Kirjaudu ulos</button>
  </nav>
);

export default Navbar;
