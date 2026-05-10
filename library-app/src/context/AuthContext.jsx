import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, parseJwt } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const payload = parseJwt(token);
      setUser({ username: payload.sub || payload.username || '', roles: payload.roles || [] });
    } else {
      setUser(null);
    }
  }, [token]);

  function login(newToken) {
    setToken(newToken);
    setTokenState(newToken);
  }

  function logout() {
    setToken(null);
    setTokenState(null);
  }

  const isAdmin = user?.roles?.some(r => r.includes('ADMIN')) ?? false;
  const isLibrarian = user?.roles?.some(r => r.includes('LIBRARIAN')) ?? false;
  const isMember = !!user && !isAdmin && !isLibrarian;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAdmin, isLibrarian, isMember }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
