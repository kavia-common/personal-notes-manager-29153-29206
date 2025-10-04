import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({ open, onClose, onSave, initial }) {
  /**
   * A modal dialog for creating or editing a note.
   * Props:
   * - open: boolean
   * - onClose: function
   * - onSave: function(notePayload)
   * - initial: { id?, title, content }
   */
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setContent(initial?.content || '');
    }
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit note' : 'Create note'}>
      <div className="modal">
        <div className="space-between" style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>{isEdit ? 'Edit Note' : 'Create Note'}</h2>
          <button className="btn ghost" onClick={onClose} aria-label="Close editor">Close</button>
        </div>
        <div className="field">
          <label htmlFor="note-title" className="label">Title</label>
          <input
            id="note-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
        </div>
        <div className="field">
          <label htmlFor="note-content" className="label">Content</label>
          <textarea
            id="note-content"
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
          />
        </div>
        <div className="space-between">
          <span className="helper">{isEdit ? 'Update existing note' : 'Create a new note'}</span>
          <button
            className="btn"
            onClick={() => onSave({ title: title.trim(), content: content.trim() })}
            aria-label={isEdit ? 'Save changes' : 'Create note'}
            disabled={!title.trim()}
          >
            {isEdit ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
