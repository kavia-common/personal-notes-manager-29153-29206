import React from 'react';

// PUBLIC_INTERFACE
export default function NoteList({ notes, page, pageSize, total, onPageChange, onEdit, onDelete, search, onSearch }) {
  /**
   * Renders a list of notes with search and pagination controls.
   */
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="toolbar">
        <div className="field" style={{ marginBottom: 0, flex: 1 }}>
          <label htmlFor="search" className="label">Search notes</label>
          <input
            id="search"
            className="input"
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search notes"
          />
        </div>
        <div className="row">
          <span className="helper">Total: {total ?? 0}</span>
        </div>
      </div>

      <div className="list" role="list" aria-label="Notes list">
        {notes?.length ? notes.map((n) => (
          <div key={n.id} className="list-item" role="listitem">
            <div className="space-between">
              <div>
                <div style={{ fontWeight: 700 }}>{n.title}</div>
                <div className="helper">Updated {new Date(n.updated_at || n.updatedAt || Date.now()).toLocaleString()}</div>
              </div>
              <div className="row">
                <button className="btn ghost" onClick={() => onEdit(n)} aria-label={`Edit ${n.title}`}>Edit</button>
                <button className="btn danger" onClick={() => onDelete(n)} aria-label={`Delete ${n.title}`}>Delete</button>
              </div>
            </div>
            {n.content ? <div style={{ color: '#374151', marginTop: 6 }}>{n.content.length > 160 ? n.content.slice(0, 160) + '…' : n.content}</div> : null}
          </div>
        )) : (
          <div className="alert" style={{ borderColor: '#E5E7EB' }}>
            No notes found. Try adjusting your search or create a new note.
          </div>
        )}
      </div>

      <div className="pagination" aria-label="Pagination">
        <button className="btn ghost" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} aria-label="Previous page">Prev</button>
        <span className="badge">Page {page} of {totalPages}</span>
        <button className="btn ghost" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} aria-label="Next page">Next</button>
      </div>
    </div>
  );
}
