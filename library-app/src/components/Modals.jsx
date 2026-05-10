import { useState, useEffect } from 'react';
import { Btn, Msg } from './ui';
import { api } from '../api/client';

// ── BOOK MODAL ────────────────────────────────────
export function BookModal({ open, onClose, book, onSaved }) {
  const editing = !!book;
  const [form, setForm] = useState({ title: '', author: '', isbn: '', copies: 1, imageUrl: '' });
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(book
        ? { title: book.title || '', author: book.author || '', isbn: book.isbn || '', copies: book.copies ?? 1, imageUrl: book.imageUrl || '' }
        : { title: '', author: '', isbn: '', copies: 1, imageUrl: '' }
      );
      setMsg(null);
    }
  }, [open, book]);

  async function save() {
    if (!form.title || !form.author) return setMsg({ type: 'error', text: 'Title and author are required' });
    setSaving(true);
    const r = await api(
      editing ? `/library/books/edit/${book.id}` : '/library/books/add',
      { method: editing ? 'PUT' : 'POST', body: JSON.stringify({ ...form, copies: parseInt(form.copies) || 1, imageUrl: form.imageUrl || null }) }
    );
    setSaving(false);
    if (r.ok || r.status === 201) { onSaved(); onClose(); }
    else setMsg({ type: 'error', text: `Save failed (${r.status})` });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl p-6 w-[440px] max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto shadow-2xl">
        <h3 className="text-base font-semibold mb-5">{editing ? 'Edit book' : 'Add book'}</h3>
        <Msg msg={msg} />
        {[
          { label: 'Title', key: 'title', type: 'text' },
          { label: 'Author', key: 'author', type: 'text' },
          { label: 'ISBN', key: 'isbn', type: 'text' },
          { label: 'Copies', key: 'copies', type: 'number' },
          { label: 'Image URL', key: 'imageUrl', type: 'text', placeholder: 'https://…' },
        ].map(f => (
          <div key={f.key} className="mb-4">
            <label className="block text-[12px] font-medium text-gray-500 mb-1 tracking-wide">{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              min={f.type === 'number' ? 1 : undefined}
              placeholder={f.placeholder || ''}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors"
            />
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-5">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
        </div>
      </div>
    </div>
  );
}

// ── BORROW MODAL ──────────────────────────────────
export function BorrowModal({ open, onClose, book, onDone }) {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (open) setMsg(null); }, [open]);

  async function confirm() {
    setLoading(true);
    const r = await api('/borrow/request', { method: 'POST', body: JSON.stringify({ bookId: book?.id }) });
    setLoading(false);
    if (r.ok) { onDone(); onClose(); }
    else {
      const txt = await r.text().catch(() => '');
      setMsg({ type: 'error', text: txt || `Request failed (${r.status})` });
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl p-6 w-[440px] max-w-[calc(100vw-2rem)] shadow-2xl">
        <h3 className="text-base font-semibold mb-4">Borrow request</h3>
        <p className="text-sm text-gray-500 mb-4">Book: <strong className="text-[#1a1a1a]">{book?.title}</strong></p>
        <Msg msg={msg} />
        <div className="flex justify-end gap-2 mt-5">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="success" onClick={confirm} disabled={loading}>{loading ? 'Submitting…' : 'Confirm'}</Btn>
        </div>
      </div>
    </div>
  );
}

// ── USER EDIT MODAL ───────────────────────────────
export function UserEditModal({ open, user, onClose, onSaved }) {
  const [name, setName] = useState('');
  const [roles, setRoles] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      setName(user.username || '');
      setRoles((user.roles || []).join(', '));
    }
  }, [open, user]);

  async function save() {
    setSaving(true);
    const roleArr = roles.split(',').map(r => r.trim()).filter(Boolean);
    await api(`/admin/users/${user.id}/username`, { method: 'PUT', body: JSON.stringify(name) });
    await api(`/admin/users/${user.id}/roles`, { method: 'PUT', body: JSON.stringify(roleArr) });
    setSaving(false);
    onSaved();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl p-6 w-[440px] max-w-[calc(100vw-2rem)] shadow-2xl">
        <h3 className="text-base font-semibold mb-5">Edit user</h3>
        <div className="mb-4">
          <label className="block text-[12px] font-medium text-gray-500 mb-1">Username</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors" />
        </div>
        <div className="mb-4">
          <label className="block text-[12px] font-medium text-gray-500 mb-1">Roles (comma-separated)</label>
          <input type="text" value={roles} onChange={e => setRoles(e.target.value)} placeholder="ROLE_USER, ROLE_ADMIN" className="w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors" />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Btn>
        </div>
      </div>
    </div>
  );
}
