import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Collapsible navigation sidebar. */
  const location = useLocation();

  const openCreate = () => {
    const evt = new CustomEvent('notes:create');
    window.dispatchEvent(evt);
  };

  return (
    <aside className="ocean-sidebar" aria-label="Sidebar navigation">
      <div className="field">
        <button className="btn" onClick={openCreate} aria-label="Create Note">+ New Note</button>
        <span className="helper">Create a new note</span>
      </div>
      <nav className="list" aria-label="Primary navigation">
        <Link to="/notes" className="list-item" aria-current={location.pathname === '/notes' ? 'page' : 'false'}>
          Notes
        </Link>
      </nav>
    </aside>
  );
}
