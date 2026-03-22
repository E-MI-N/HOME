import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'PROFILE', path: '/profile' },
  { label: 'GALLERY', path: '/gallery' },
  { label: 'ARCHIVE', path: '/archive' },
  { label: 'TRPG', path: '/trpg' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const timeStr = time.toTimeString().slice(0, 8);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        borderBottom: scrolled ? '1px solid rgba(110,207,184,0.2)' : '1px solid transparent',
        backgroundColor: scrolled ? 'rgba(8,8,8,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="px-6 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="cursor-pointer flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <span
            className="font-mono text-xs tracking-[0.2em] transition-colors duration-200"
            style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace' }}
          >
            ◈ SUNJAE.SYS
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="font-mono tracking-[0.15em] transition-colors duration-200 cursor-pointer whitespace-nowrap relative"
                  style={{
                    fontSize: '13px',
                    color: isActive ? '#6ECFB8' : '#585854',
                    fontFamily: 'Space Mono, monospace',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#8EEBD8')}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = isActive ? '#6ECFB8' : '#585854';
                  }}
                >
                  {isActive && <span style={{ color: '#6ECFB8', marginRight: '4px' }}>{'>'}</span>}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Clock */}
        <div className="hidden md:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-none" style={{ backgroundColor: '#6ECFB8', animation: 'blink 1.4s step-end infinite' }} />
          <span className="font-mono" style={{ color: '#384A45', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
            {timeStr}
          </span>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden cursor-pointer font-mono text-xs transition-colors duration-200 whitespace-nowrap"
          style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '[CLOSE]' : '[MENU]'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#080808', borderTop: '1px solid rgba(110,207,184,0.15)' }}>
          <ul className="flex flex-col py-3">
            {navLinks.map((link, i) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="flex items-center gap-3 px-6 py-3 font-mono text-xs tracking-[0.15em] transition-colors duration-200 cursor-pointer"
                  style={{
                    color: location.pathname === link.path ? '#6ECFB8' : '#585854',
                    fontFamily: 'Space Mono, monospace',
                  }}
                >
                  <span style={{ color: '#384A45' }}>0{i + 1}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
