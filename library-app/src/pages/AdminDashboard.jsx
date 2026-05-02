import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { StatGrid, SectionTitle } from '../components/ui';

export default function AdminDashboard() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api('/admin/dashboard').then(r => r.ok && r.json().then(setD));
  }, []);

  return (
    <div>
      <SectionTitle>Admin Dashboard</SectionTitle>
      <StatGrid stats={[
        { label: 'Total users', value: d?.totalUsers },
        { label: 'Total books', value: d?.totalBooks },
        { label: 'Borrowed', value: d?.totalBorrowedBooks },
        { label: 'Overdue', value: d?.totalOverdueBooks, tone: 'warn' },
        { label: 'Pending returns', value: d?.totalPendingReturns },
      ]} />
    </div>
  );
}
