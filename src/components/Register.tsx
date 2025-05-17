import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Rekisteröityminen epäonnistui.');
    }
  };

  return (
    <div className="register-container">
      <p style={{ color: 'blue' }}>Valmistellaan rekisteröitymistä!</p>
      <h2>Luo uusi käyttäjä</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Sähköposti:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Salasana:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button type="submit">Rekisteröidy</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Rekisteröityminen onnistui!</p>}
    </div>
  );
};

export default Register;
