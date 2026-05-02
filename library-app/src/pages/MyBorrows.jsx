import { useState, useEffect } from 'react';
import { api, parseJwt, getToken } from '../api/client';
import { DataTable, SectionTitle, Card, Badge, Mono, Msg, Btn } from '../components/ui';

export default function MyBorrows() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    let myId = '';
    try { myId = parseJwt(getToken()).id || ''; } catch {}
    const r = await api(`/borrow/history/${myId}`);
    setLoading(false);
    if (!r.ok) { setErr({ type: 'error', text: 'Failed to load' }); return; }
    setRows(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function doReturn(id) {
    if (!confirm('Confirm return?')) return;
    const r = await api(`/borrow/return/${id}`, { method: 'POST' });
    if (r.ok) load(); else setErr({ type: 'error', text: 'Return failed' });
  }

  async function doCancel(id) {
    if (!confirm('Cancel this borrow?')) return;
    const r = await api(`/borrow/cancel/${id}`, { method: 'POST' });
    if (r.ok) load(); else setErr({ type: 'error', text: 'Cancel failed' });
  }

  return (
    <div>
      <SectionTitle>My Borrows</SectionTitle>
      <Msg msg={err} />
      <Card>
        <DataTable
          loading={loading}
          empty="No borrows yet"
          columns={[
            { key: 'id', label: 'Borrow ID', render: v => <Mono text={v} /> },
            { key: 'bookId', label: 'Book ID', render: v => <Mono text={v} /> },
            { key: 'status', label: 'Status', render: v => <Badge text={v} /> },
            { key: 'requestStatus', label: 'Request status', render: v => <Badge text={v} /> },
            { key: 'dueDate', label: 'Due date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
          ]}
          rows={rows}
          actions={row => <>
            {(row.status === 'ACTIVE' || row.status === 'APPROVED') && (
              <Btn size="xs" variant="success" onClick={() => doReturn(row.id)}>Return</Btn>
            )}
            {row.requestStatus === 'REQUESTED' && (
              <Btn size="xs" variant="warn" onClick={() => doCancel(row.id)}>Cancel</Btn>
            )}
          </>}
        />
      </Card>
    </div>
  );
}
