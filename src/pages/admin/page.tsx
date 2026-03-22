import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CharactersSection from './sections/CharactersSection';
import ArchiveSection from './sections/ArchiveSection';
import TrpgSection from './sections/TrpgSection';
import MusicSection from './sections/MusicSection';
import GallerySection from './sections/GallerySection';
import DashboardSection from './sections/DashboardSection';

const ADMIN_KEY = 'arael_admin';
const ADMIN_PW = '181175';

type Tab = 'characters' | 'archive' | 'trpg' | 'music' | 'gallery' | 'dashboard';

const TABS: { id: Tab; label: string }[] = [
  { id: 'characters', label: '캐릭터' },
  { id: 'archive', label: '아카이브' },
  { id: 'trpg', label: 'TRPG' },
  { id: 'music', label: '음악' },
  { id: 'gallery', label: '갤러리' },
  { id: 'dashboard', label: '대시보드' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('characters');
  const [toast, setToast] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  useEffect(() => {
    if (localStorage.getItem(ADMIN_KEY) === ADMIN_PW) {
      setAuthChecked(true);
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    navigate('/admin/login');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#080808' }}>
        <p className="font-mono text-xs" style={{ color: '#383834' }}>LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080808', color: '#A0A098' }}>
      {/* Top Bar */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-8 h-14"
        style={{ borderBottom: '1px solid #1C1C1C', backgroundColor: '#080808' }}
      >
        <div className="flex items-center gap-6">
          <p className="font-display text-sm tracking-widest uppercase" style={{ color: '#F0EEE8' }}>Admin</p>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#1C1C1C' }} />
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="font-mono text-xs cursor-pointer whitespace-nowrap transition-colors"
              style={{ color: activeTab === tab.id ? '#6ECFB8' : '#585854' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="/music" className="font-mono text-xs whitespace-nowrap" style={{ color: '#383834' }}>음악 보기 →</a>
          <a href="/archive" className="font-mono text-xs whitespace-nowrap" style={{ color: '#383834' }}>아카이브 →</a>
          <a href="/trpg" className="font-mono text-xs whitespace-nowrap" style={{ color: '#383834' }}>TRPG →</a>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#1C1C1C' }} />
          <a href="/profile" className="font-mono text-xs whitespace-nowrap" style={{ color: '#383834' }}>프로필 →</a>
          <button
            onClick={handleLogout}
            className="font-mono text-xs px-3 py-1.5 cursor-pointer whitespace-nowrap transition-colors"
            style={{ border: '1px solid #1C1C1C', color: '#585854' }}
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="px-8 py-10 max-w-4xl mx-auto">
        {activeTab === 'characters' && <CharactersSection showToast={showToast} />}
        {activeTab === 'archive' && <ArchiveSection showToast={showToast} />}
        {activeTab === 'trpg' && <TrpgSection showToast={showToast} />}
        {activeTab === 'music' && <MusicSection showToast={showToast} />}
        {activeTab === 'gallery' && <GallerySection showToast={showToast} />}
        {activeTab === 'dashboard' && <DashboardSection showToast={showToast} />}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-16 right-6 px-5 py-3 font-mono text-xs z-50"
          style={{ border: '1px solid rgba(110,207,184,0.3)', backgroundColor: 'rgba(8,8,8,0.95)', color: '#6ECFB8' }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
