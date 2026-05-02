import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { DataTable, SectionTitle, Card, Badge, Mono } from '../components/ui';

export default function AllBorrows() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/borrow/list').then(async r => {
      if (r.ok) setRows(await r.json());
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <SectionTitle>All Borrows</SectionTitle>
      <Card>
        <DataTable
          loading={loading}
          empty="No borrows found"
          columns={[
            { key: 'id', label: 'Borrow ID', render: v => <Mono text={v} /> },
            { key: 'userId', label: 'User ID', render: v => <Mono text={v} /> },
            { key: 'bookId', label: 'Book ID', render: v => <Mono text={v} /> },
            { key: 'status', label: 'Status', render: v => <Badge text={v} /> },
            { key: 'requestStatus', label: 'Request status', render: v => <Badge text={v} /> },
            { key: 'dueDate', label: 'Due date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
          ]}
          rows={rows}
        />
      </Card>
    </div>
  );
}
