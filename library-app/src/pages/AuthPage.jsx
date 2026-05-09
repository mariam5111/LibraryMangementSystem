import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, parseJwt } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Msg, Btn } from '../components/ui';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', password: '' });
  const [loginMsg, setLoginMsg] = useState(null);
  const [regMsg, setRegMsg] = useState(null);
  const [tokenPreview, setTokenPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAdmin, isLibrarian } = useAuth();
  const navigate = useNavigate();

  async function doLogin() {
    const { username, password } = loginForm;
    if (!username || !password) return setLoginMsg({ type: 'error', text: 'Fill in both fields' });
    setLoading(true);
    const r = await api('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    setLoading(false);
    if (r.ok) {
      const token = await r.text();
      setTokenPreview('JWT: ' + token.slice(0, 80) + '…');
      setLoginMsg({ type: 'success', text: 'Signed in' });
      login(token);
      const payload = parseJwt(token);
      const roles = payload.roles || [];
      const adm = roles.some(r => r.includes('ADMIN'));
      const lib = roles.some(r => r.includes('LIBRARIAN'));
      setTimeout(() => navigate(adm ? '/admin/dashboard' : lib ? '/librarian/dashboard' : '/member/dashboard'), 300);
    } else {
      setLoginMsg({ type: 'error', text: r.status === 401 ? 'Invalid credentials' : `Login failed (${r.status})` });
    }
  }

  async function doRegister() {
    const { username, password } = regForm;
    if (!username || !password) return setRegMsg({ type: 'error', text: 'Fill in both fields' });
    setLoading(true);
    const r = await api('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) });
    setLoading(false);
    if (r.status === 201) setRegMsg({ type: 'success', text: 'Account created — sign in now' });
    else if (r.status === 409) setRegMsg({ type: 'error', text: 'Username already taken' });
    else setRegMsg({ type: 'error', text: 'Registration failed' });
  }

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex flex-col">
      {/* minimal nav */}
      <nav className="bg-white border-b border-[#e8e6e0] px-6 flex items-center h-[52px]">
        <span className="font-semibold text-base tracking-tight">LibSystem</span>
      </nav>
      <div className="flex-1 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-[380px]">
          <h1 className="text-[22px] font-semibold tracking-tight mb-6">Library System</h1>

          {/* Tabs */}
          <div className="flex border-b border-[#e8e6e0] mb-6">
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm border-b-2 -mb-px transition-all cursor-pointer ${
                  tab === t
                    ? 'text-[#1a1a1a] border-[#1a1a1a] font-medium'
                    : 'text-gray-400 border-transparent hover:text-[#1a1a1a]'
                }`}
              >
                {t === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          {tab === 'login' && (
            <div>
              <Msg msg={loginMsg} />
              <div className="mb-4">
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  placeholder="username"
                  onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && doLogin()}
                  className="w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <Btn variant="primary" className="w-full justify-center" onClick={doLogin} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Btn>
              {tokenPreview && (
                <div className="font-mono text-[11px] bg-[#f5f4f1] border border-[#e8e6e0] text-gray-400 px-2 py-2 rounded-md break-all mt-3">
                  {tokenPreview}
                </div>
              )}
            </div>
          )}

          {tab === 'register' && (
            <div>
              <Msg msg={regMsg} />
              <div className="mb-4">
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Username</label>
                <input
                  type="text"
                  value={regForm.username}
                  onChange={e => setRegForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Password</label>
                <input
                  type="password"
                  value={regForm.password}
                  onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-2.5 py-2 border border-[#ddd] rounded-md text-sm outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <Btn variant="primary" className="w-full justify-center" onClick={doRegister} disabled={loading}>
                {loading ? 'Creating…!' : 'Create account'}
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
