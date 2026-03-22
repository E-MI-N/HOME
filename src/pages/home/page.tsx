import { useInView } from '../../hooks/useInView';
import HeroSection from './components/HeroSection';
import CalendarWidget from './components/CalendarWidget';
import DdayWidget from './components/DdayWidget';

function DashboardSection() {
  const { ref, inView } = useInView();
  return (
    <section
      ref={ref}
      className={`anim-element ${inView ? 'is-visible' : ''} px-6 md:px-10 py-10`}
      style={{ borderBottom: '1px solid rgba(110,207,184,0.1)' }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono" style={{ color: '#384A45', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
          {'//'}
        </span>
        <span className="font-mono" style={{ color: '#6ECFB8', fontFamily: 'Space Mono, monospace', fontSize: '12px', letterSpacing: '0.2em' }}>
          DASHBOARD
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(110,207,184,0.1)' }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CalendarWidget />
        <DdayWidget />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <DashboardSection />
    </div>
  );
}
