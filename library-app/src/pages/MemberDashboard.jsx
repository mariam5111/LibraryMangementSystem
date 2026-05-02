import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { StatGrid, SectionTitle } from '../components/ui';

export default function MemberDashboard() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api('/member/dashboard').then(r => r.ok && r.json().then(setD));
  }, []);

  return (
    <div>
      <SectionTitle>My Dashboard</SectionTitle>
      <StatGrid stats={[
        { label: 'Active borrows', value: d?.activeBorrowCount, tone: 'good' },
        { label: 'Overdue', value: d?.overdueCount, tone: 'warn' },
        { label: 'Borrow history', value: d?.historyCount },
      ]} />
    </div>
  );
}
