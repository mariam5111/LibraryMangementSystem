import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const ADMIN_LINKS = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Users', to: '/admin/users' },
];
const LIBRARIAN_LINKS = [
  { label: 'Dashboard', to: '/librarian/dashboard' },
  { label: 'Pending requests', to: '/librarian/requests' },
  { label: 'All borrows', to: '/librarian/borrows' },
  { label: 'Book catalog', to: '/librarian/books' },
];
const MEMBER_LINKS = [
  { label: 'Dashboard', to: '/member/dashboard' },
  { label: 'Browse books', to: '/member/books' },
  { label: 'My borrows', to: '/member/borrows' },
];

export function Layout({ children }) {
  const { user, logout, isAdmin, isLibrarian } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const links = isAdmin ? ADMIN_LINKS : isLibrarian ? LIBRARIAN_LINKS : MEMBER_LINKS;
  const section = isAdmin ? 'Admin' : isLibrarian ? 'Librarian' : 'Member';
  const badgeCls = isAdmin
    ? 'bg-amber-100 text-amber-800'
    : isLibrarian
    ? 'bg-blue-100 text-blue-800'
    : 'bg-green-100 text-green-800';
  const badgeLabel = isAdmin ? 'ADMIN' : isLibrarian ? 'LIBRARIAN' : 'MEMBER';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#e8e6e0] px-6 flex items-center gap-3 h-[52px] sticky top-0 z-50">
        <span className="font-semibold text-base tracking-tight">LibSystem</span>
        {user && (
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${badgeCls}`}>
            {badgeLabel}
          </span>
        )}
        <div className="flex-1" />
        {user && <span className="text-sm text-gray-400">{user.username}</span>}
        {user && (
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 border border-[#ddd] bg-white text-[#1a1a1a] rounded-md px-2.5 py-1 text-xs hover:bg-[#f5f4f1] hover:border-[#bbb] transition-all cursor-pointer"
          >
            Sign out
          </button>
        )}
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        {user && (
          <aside className="w-[200px] bg-white border-r border-[#e8e6e0] py-4 flex-shrink-0">
            <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-widest px-5 py-3 pt-1">
              {section}
            </div>
            {links.map(l => {
              const active = location.pathname === l.to || (l.to !== '/' && location.pathname.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`block px-5 py-2 text-[13px] border-l-[3px] transition-all ${
                    active
                      ? 'bg-[#f9f8f5] text-[#1a1a1a] border-l-[#1a1a1a] font-medium'
                      : 'text-gray-500 border-l-transparent hover:bg-[#f9f8f5] hover:text-[#1a1a1a]'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
