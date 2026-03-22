import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'PROFILE', path: '/profile' },
  { label: 'GALLERY', path: '/gallery' },
  { label: 'ARCHIVE', path: '/archive' },
  { label: 'TRPG', path: '/trpg' },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(110,207,184,0.15)', backgroundColor: '#080808' }}>
      <div className="px-6 md:px-10 pt-10 pb-8">
        {/* Nav links */}
        <div className="flex flex-wrap gap-6 mb-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-2 font-mono tracking-widest transition-colors duration-200 cursor-pointer"
              style={{ color: '#585854', fontFamily: 'Space Mono, monospace', fontSize: '13px' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#6ECFB8')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#585854')}
            >
              <span style={{ color: '#2A3E3A', fontSize: '12px' }}>0{i + 1}.</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(110,207,184,0.2), transparent)', marginBottom: '20px' }} />

        {/* Bottom */}
        <div className="flex justify-end">
          <Link
            to="/admin/login"
            className="font-mono cursor-pointer transition-colors duration-300"
            style={{ fontSize: '9px', color: '#1A1A1A', letterSpacing: '0.1em', fontFamily: 'Space Mono, monospace' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#2A3E3A')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#1A1A1A')}
          >
            SYS_ADMIN
          </Link>
        </div>
      </div>
    </footer>
  );
}
