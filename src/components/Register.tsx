import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import FormInput from './FormInput';
import FormButton from './FormButton';

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
      <h2>Luo uusi käyttäjä</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          id="email"
          label="Sähköposti:"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <FormInput
          id="password"
          label="Salasana:"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <FormButton type="submit" style={{ width: '100%', marginBottom: 10 }}>Rekisteröidy</FormButton>
        <a
          href="/"
          style={{
            display: 'block',
            color: '#e74c3c',
            textAlign: 'center',
            marginTop: 0,
            fontSize: '0.98rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Peruuta
        </a>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Rekisteröityminen onnistui!</p>}
    </div>
  );
};

export default Register;
