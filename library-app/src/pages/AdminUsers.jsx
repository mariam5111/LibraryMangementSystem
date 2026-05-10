import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import { DataTable, SectionTitle, Card, Mono, Msg, Btn } from '../components/ui';
import { RoleBadges } from '../components/ui';
import { UserEditModal } from '../components/Modals';

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [err, setErr] = useState(null);
  const [editing, setEditing] = useState(null);
  const timer = useRef(null);

  async function load(q = '') {
    setLoading(true); setErr(null);
    const path = q ? `/admin/users/search?name=${encodeURIComponent(q)}` : '/admin/users';
    const r = await api(path);
    setLoading(false);
    if (r.ok) setRows(await r.json());
    else setErr({ type: 'error', text: 'Failed to load users' });
  }

  useEffect(() => { load(); }, []);

  function onSearch(e) {
    const v = e.target.value; setQuery(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => load(v), 350);
  }

  async function del(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    const r = await api(`/admin/users/${id}`, { method: 'DELETE' });
    if (r.ok || r.status === 204) load(query);
    else setErr({ type: 'error', text: 'Delete failed' });
  }

  return (
    <div>
      <SectionTitle>User Management</SectionTitle>
      <Card>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <input
            type="text"
            value={query}
            onChange={onSearch}
            placeholder="Search by username…"
            className="max-w-[260px] w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors"
          />
          <div className="flex-1" />
          <Btn size="sm" onClick={() => load(query)}>Refresh</Btn>
        </div>
        <Msg msg={err} />
        <DataTable
          loading={loading}
          empty="No users found"
          columns={[
            { key: 'id', label: 'ID', render: v => <Mono text={v} /> },
            { key: 'username', label: 'Username', render: v => <strong>{v}</strong> },
            { key: 'roles', label: 'Roles', render: (_, row) => <RoleBadges roles={row.roles} /> },
          ]}
          rows={rows}
          actions={row => <>
            <Btn size="xs" onClick={() => setEditing(row)}>Edit</Btn>
            <Btn size="xs" variant="danger" onClick={() => del(row.id, row.username)}>Delete</Btn>
          </>}
        />
      </Card>

      <UserEditModal
        open={!!editing}
        user={editing}
        onClose={() => setEditing(null)}
        onSaved={() => load(query)}
      />
    </div>
  );
}
