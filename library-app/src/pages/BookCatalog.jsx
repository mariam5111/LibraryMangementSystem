import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import { SectionTitle, Msg, Btn } from '../components/ui';
import { BookModal, BorrowModal } from '../components/Modals';

export default function BookCatalog({ isLibrarian = false, isMember = false }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [flash, setFlash] = useState(null);
  const [bookModal, setBookModal] = useState({ open: false, book: null });
  const [borrowModal, setBorrowModal] = useState({ open: false, book: null });
  const timer = useRef(null);

  async function fetchBooks(q = '') {
    setLoading(true);
    const path = q ? `/library/books/search?q=${encodeURIComponent(q)}` : '/library/books';
    const r = await api(path);
    setLoading(false);
    if (r.ok) setBooks(await r.json());
  }

  useEffect(() => { fetchBooks(); }, []);

  function onSearch(e) {
    const v = e.target.value; setQuery(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fetchBooks(v), 350);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this book?')) return;
    const r = await api(`/library/books/delete/${id}`, { method: 'DELETE' });
    if (r.ok || r.status === 204) fetchBooks(query);
  }

  const skeletons = Array.from({ length: 6 }, (_, i) => (
    <div key={i} className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden flex flex-col">
      <div className="shimmer h-[140px] w-full" />
      <div className="p-3 flex flex-col gap-2">
        <div className="shimmer h-3.5 rounded" />
        <div className="shimmer h-3 w-3/5 rounded" />
      </div>
    </div>
  ));

  return (
    <div>
      <SectionTitle>Book Catalog</SectionTitle>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input
          type="text"
          value={query}
          onChange={onSearch}
          placeholder="Search title or author…"
          className="max-w-[260px] w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors"
        />
        <div className="flex-1" />
        {isLibrarian && (
          <Btn variant="primary" size="sm" onClick={() => setBookModal({ open: true, book: null })}>
            + Add book
          </Btn>
        )}
      </div>

      {flash && <Msg msg={flash} />}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
        {loading ? skeletons : !books.length
          ? <div className="col-span-full text-center py-12 text-gray-400 text-sm">No books found</div>
          : books.map(b => (
            <div key={b.id} className="bg-white border border-[#e8e6e0] rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <div className="h-[140px] bg-[#f0ede6] flex items-center justify-center text-[32px] text-gray-300 overflow-hidden">
                {b.imageUrl
                  ? <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; e.target.parentElement.textContent = '📚'; }} />
                  : '📚'}
              </div>
              <div className="p-3 flex-1 flex flex-col gap-1">
                <div className="text-[13px] font-semibold leading-tight">{b.title}</div>
                <div className="text-[12px] text-gray-400">{b.author}</div>
                <div className="text-[11px] text-gray-300 mt-auto pt-1.5">
                  ISBN: {b.isbn || '—'} · {b.copies ?? '?'} copies
                </div>
              </div>
              <div className="px-3 pb-3 flex gap-1.5 flex-wrap">
                {isLibrarian && <>
                  <Btn size="xs" onClick={() => setBookModal({ open: true, book: b })}>Edit</Btn>
                  <Btn size="xs" variant="danger" onClick={() => handleDelete(b.id)}>Delete</Btn>
                </>}
                {isMember && (
                  <Btn size="xs" variant="success" onClick={() => setBorrowModal({ open: true, book: b })}>Borrow</Btn>
                )}
              </div>
            </div>
          ))
        }
      </div>

      <BookModal
        open={bookModal.open}
        book={bookModal.book}
        onClose={() => setBookModal({ open: false, book: null })}
        onSaved={() => fetchBooks(query)}
      />

      <BorrowModal
        open={borrowModal.open}
        book={borrowModal.book}
        onClose={() => setBorrowModal({ open: false, book: null })}
        onDone={() => {
          setFlash({ type: 'success', text: 'Borrow request submitted!' });
          setTimeout(() => setFlash(null), 3000);
        }}
      />
    </div>
  );
}
