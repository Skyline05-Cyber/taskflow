import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);

    if (signInError) {
      setError('Incorrect email or password.');
      return;
    }
    navigate('/app');
  }

  return (
    <div className="app-shell auth-card">
      <Link to="/" className="brand-link">TaskFlow</Link>
      <h1>Welcome back</h1>
      <p className="subtitle">Log in to see your tasks.</p>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'}</button>
      </form>

      <p className="subtitle" style={{ marginTop: '1.5rem' }}>
        No account yet? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
