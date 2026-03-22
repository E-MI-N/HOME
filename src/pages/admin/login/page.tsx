import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_KEY = 'arael_admin';
const ADMIN_PW = '181175';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (password === ADMIN_PW) {
        localStorage.setItem(ADMIN_KEY, ADMIN_PW);
        navigate('/admin');
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#080808' }}>
      <div className="w-full max-w-xs px-6">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs mb-3 tracking-[0.25em]" style={{ color: '#383834' }}>
            ◈ ARAEL.SYS
          </p>
          <h1
            className="font-mono text-2xl tracking-[0.15em] uppercase"
            style={{ color: '#F0EEE8', fontFamily: 'Space Mono, monospace' }}
          >
            ADMIN
          </h1>
          <div
            className="mt-4 mx-auto"
            style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, #6ECFB8, transparent)' }}
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="block font-mono text-xs mb-2 tracking-widest"
              style={{ color: '#585854', fontFamily: 'Space Mono, monospace' }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full px-4 py-3 font-mono text-sm bg-transparent outline-none transition-colors"
              style={{
                border: '1px solid #1C1C1C',
                color: '#F0EEE8',
                caretColor: '#6ECFB8',
                fontFamily: 'Space Mono, monospace',
                letterSpacing: '0.2em',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(110,207,184,0.4)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#1C1C1C'; }}
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-xs" style={{ color: '#CF6E6E', fontFamily: 'Space Mono, monospace' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-mono text-xs tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: loading ? 'transparent' : 'rgba(110,207,184,0.1)',
              border: '1px solid rgba(110,207,184,0.3)',
              color: loading ? '#383834' : '#6ECFB8',
              fontFamily: 'Space Mono, monospace',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(110,207,184,0.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = loading ? 'transparent' : 'rgba(110,207,184,0.1)'; }}
          >
            {loading ? 'VERIFYING...' : 'ENTER'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="font-mono text-xs cursor-pointer transition-colors"
            style={{ color: '#2A3E3A', fontFamily: 'Space Mono, monospace' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#6ECFB8')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#2A3E3A')}
          >
            ← 사이트로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
