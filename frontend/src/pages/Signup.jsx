import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp(email, password);
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setConfirmSent(true);
  }

  if (confirmSent) {
    return (
      <div className="app-shell auth-card">
        <h1>Check your inbox</h1>
        <p className="subtitle">We sent a confirmation link to {email}. Confirm it, then come back and log in.</p>
        <Link to="/login">Back to login</Link>
      </div>
    );
  }

  return (
    <div className="app-shell auth-card">
      <Link to="/" className="brand-link">TaskFlow</Link>
      <h1>Create your account</h1>
      <p className="subtitle">Your tasks, private to you.</p>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Sign up'}</button>
      </form>

      <p className="subtitle" style={{ marginTop: '1.5rem' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
