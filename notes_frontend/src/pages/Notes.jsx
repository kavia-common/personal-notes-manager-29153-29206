import React, { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';

// PUBLIC_INTERFACE
export default function Notes() {
  /** Notes list, search, pagination, and editor modal. */
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.notes.list({ search, page, page_size: pageSize });
      // Normalize response: support either {items, total} or array
      const items = Array.isArray(res) ? res : (res?.items || res?.data || []);
      const totalCount = Array.isArray(res) ? items.length : (res?.total || res?.count || items.length);
      setNotes(items);
      setTotal(totalCount);
    } catch (e) {
      showToast(e.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize, showToast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const openCreate = () => {
      setEditing(null);
      setEditorOpen(true);
    };
    window.addEventListener('notes:create', openCreate);
    return () => window.removeEventListener('notes:create', openCreate);
  }, []);

  const onEdit = (note) => {
    setEditing(note);
    setEditorOpen(true);
  };

  const onDelete = async (note) => {
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return;
    try {
      await api.notes.remove(note.id);
      showToast('Note deleted', 'success');
      fetchNotes();
    } catch (e) {
      showToast(e.message || 'Failed to delete note');
    }
  };

  const onSave = async (payload) => {
    try {
      if (editing?.id) {
        await api.notes.update(editing.id, payload);
        showToast('Note updated', 'success');
      } else {
        await api.notes.create(payload);
        showToast('Note created', 'success');
      }
      setEditorOpen(false);
      setEditing(null);
      fetchNotes();
    } catch (e) {
      showToast(e.message || 'Failed to save note');
    }
  };

  const headerRight = useMemo(() => (
    <div className="row">
      <button className="btn" onClick={() => { setEditing(null); setEditorOpen(true); }}>New</button>
    </div>
  ), []);

  return (
    <div>
      <div className="space-between" style={{ marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Your Notes</h2>
          <p className="helper">Manage, search, and organize your notes.</p>
        </div>
        {headerRight}
      </div>

      {toast ? <div className={`alert ${toast.type === 'success' ? 'success' : 'error'}`} role="status" style={{ marginBottom: 12 }}>{toast.message}</div> : null}

      {loading ? (
        <div className="card" style={{ padding: 16 }}>Loading…</div>
      ) : (
        <NoteList
          notes={notes}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onEdit={onEdit}
          onDelete={onDelete}
          search={search}
          onSearch={(q) => { setSearch(q); setPage(1); }}
        />
      )}

      <NoteEditor
        open={editorOpen}
        onClose={() => { setEditorOpen(false); setEditing(null); }}
        onSave={onSave}
        initial={editing}
      />
    </div>
  );
}
