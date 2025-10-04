import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Register() {
  /** Register form page */
  const { register, isAuthenticated, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const to = location.state?.from?.pathname || '/notes';
      nav(to, { replace: true });
    }
  }, [isAuthenticated, nav, location]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await register(email, password);
    if (ok) {
      const to = location.state?.from?.pathname || '/notes';
      nav(to, { replace: true });
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }} className="card">
      <form onSubmit={onSubmit} style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Create your account</h2>
        <p className="helper">Get started with Personal Notes.</p>

        {error ? <div className="alert error" role="alert" style={{ marginBottom: 12 }}>{error}</div> : null}

        <div className="field">
          <label htmlFor="email" className="label">Email</label>
          <input id="email" className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="password" className="label">Password</label>
          <input id="password" className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        <div className="space-between">
          <Link to="/login">Already have an account?</Link>
          <button className="btn secondary" type="submit" disabled={loading} aria-busy={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        </div>
      </form>
    </div>
  );
}
