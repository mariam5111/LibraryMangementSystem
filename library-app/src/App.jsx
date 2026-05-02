import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import LibrarianDashboard from './pages/LibrarianDashboard';
import PendingRequests from './pages/PendingRequests';
import AllBorrows from './pages/AllBorrows';
import BookCatalog from './pages/BookCatalog';
import MemberDashboard from './pages/MemberDashboard';
import MyBorrows from './pages/MyBorrows';

function ProtectedRoute({ children, allow }) {
  const auth = useAuth();
  if (!auth.user) return <Navigate to="/" replace />;
  if (!allow(auth)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const auth = useAuth();

  // Redirect logged-in users away from auth page
  function DefaultRedirect() {
    if (!auth.user) return <AuthPage />;
    if (auth.isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (auth.isLibrarian) return <Navigate to="/librarian/dashboard" replace />;
    return <Navigate to="/member/dashboard" replace />;
  }

  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<DefaultRedirect />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allow={a => a.isAdmin}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allow={a => a.isAdmin}>
          <Layout><AdminUsers /></Layout>
        </ProtectedRoute>
      } />

      {/* Librarian routes */}
      <Route path="/librarian/dashboard" element={
        <ProtectedRoute allow={a => a.isLibrarian}>
          <Layout><LibrarianDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/librarian/requests" element={
        <ProtectedRoute allow={a => a.isLibrarian}>
          <Layout><PendingRequests /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/librarian/borrows" element={
        <ProtectedRoute allow={a => a.isLibrarian}>
          <Layout><AllBorrows /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/librarian/books" element={
        <ProtectedRoute allow={a => a.isLibrarian}>
          <Layout><BookCatalog isLibrarian={true} isMember={false} /></Layout>
        </ProtectedRoute>
      } />

      {/* Member routes */}
      <Route path="/member/dashboard" element={
        <ProtectedRoute allow={a => a.isMember}>
          <Layout><MemberDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/member/books" element={
        <ProtectedRoute allow={a => a.isMember}>
          <Layout><BookCatalog isLibrarian={false} isMember={true} /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/member/borrows" element={
        <ProtectedRoute allow={a => a.isMember}>
          <Layout><MyBorrows /></Layout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
