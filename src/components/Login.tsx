import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';
import FormInput from './FormInput';
import FormButton from './FormButton';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/countries');
    } catch (err: any) {
      setError('Kirjautuminen epäonnistui. Tarkista sähköposti ja salasana.');
    }
  };

  return (
    <div className="login-container">
      <h1>Tervetuloa Reissulokiin!</h1>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          id="login-email"
          label="Sähköposti:"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <FormInput
          id="login-password"
          label="Salasana:"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <FormButton type="submit">Kirjaudu</FormButton>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Ei tiliä? <Link to="/register">Rekisteröidy tästä</Link></p>
    </div>
  );
};

export default Login;
