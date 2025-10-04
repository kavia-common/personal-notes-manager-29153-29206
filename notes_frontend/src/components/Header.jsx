import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Header() {
  /** Top header with brand and user menu */
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true, state: { from: location } });
  };

  return (
    <header className="ocean-header" role="banner">
      <div className="ocean-header-inner">
        <Link to="/" className="brand" aria-label="Notes Home">
          <span className="brand-badge">N</span>
          <span>Personal Notes</span>
        </Link>
        <div className="row">
          {isAuthenticated ? (
            <>
              <span className="badge" aria-label="Signed in user">{user?.email || 'Signed in'}</span>
              <button className="btn ghost" onClick={() => navigate('/notes')}>Notes</button>
              <button className="btn danger" onClick={onLogout} aria-label="Logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn" aria-label="Login">Login</Link>
              <Link to="/register" className="btn secondary" aria-label="Register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
