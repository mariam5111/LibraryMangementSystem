import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { StatGrid, SectionTitle } from '../components/ui';

export default function LibrarianDashboard() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api('/librarian/dashboard').then(r => r.ok && r.json().then(setD));
  }, []);

  return (
    <div>
      <SectionTitle>Librarian Dashboard</SectionTitle>
      <StatGrid stats={[
        { label: 'Issued today', value: d?.booksIssuedToday, tone: 'good' },
        { label: 'Returned today', value: d?.booksReturnedToday, tone: 'good' },
        { label: 'Active borrowers', value: d?.activeBorrowers },
        { label: 'Pending returns', value: d?.pendingReturns, tone: 'warn' },
        { label: 'Currently borrowed', value: d?.currentlyBorrowedBooks },
      ]} />
    </div>
  );
}
