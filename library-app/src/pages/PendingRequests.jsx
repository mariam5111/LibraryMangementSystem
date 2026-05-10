import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { DataTable, SectionTitle, Card, Badge, Mono, Msg, Btn } from '../components/ui';

export default function PendingRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function load() {
    setLoading(true);
    const r = await api('/borrow/getAllPendingRequests');
    setLoading(false);
    if (r.ok) setRows(await r.json());
    else setErr({ type: 'error', text: 'Failed to load' });
  }

  useEffect(() => { load(); }, []);

  async function approve(id) {
    const r = await api(`/borrow/approve/${id}`, { method: 'POST' });
    if (r.ok) load(); else setErr({ type: 'error', text: 'Approve failed' });
  }

  async function reject(id) {
    const r = await api(`/borrow/reject/${id}`, { method: 'POST' });
    if (r.ok) load(); else setErr({ type: 'error', text: 'Reject failed' });
  }

  return (
    <div>
      <SectionTitle>Pending Borrow Requests</SectionTitle>
      <Msg msg={err} />
      <Card>
        <DataTable
          loading={loading}
          empty="No pending requests"
          columns={[
            { key: 'id', label: 'Borrow ID', render: v => <Mono text={v} /> },
            { key: 'userId', label: 'User ID', render: v => <Mono text={v} /> },
            { key: 'bookId', label: 'Book ID', render: v => <Mono text={v} /> },
            { key: 'requestStatus', label: 'Status', render: v => <Badge text={v} /> },
          ]}
          rows={rows}
          actions={row => <>
            <Btn size="xs" variant="success" onClick={() => approve(row.id)}>Approve</Btn>
            <Btn size="xs" variant="danger" onClick={() => reject(row.id)}>Reject</Btn>
          </>}
        />
      </Card>
    </div>
  );
}
