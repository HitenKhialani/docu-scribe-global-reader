import { Home, Columns } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar({ cardColor }: { cardColor?: string }) {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Compare Documents', icon: Columns, path: '/compare' },
  ];
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white/80 rounded-full p-2 shadow-lg border border-gray-200"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="22" height="2" rx="1"/><rect x="3" y="6" width="22" height="2" rx="1"/><rect x="3" y="20" width="22" height="2" rx="1"/></svg>
      </button>
      {/* Sidebar for desktop and as drawer on mobile */}
      <aside
        className={`h-screen flex flex-col z-40 md:static fixed top-0 left-0 transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:w-64 w-64 min-w-[16rem]`}
        style={{ background: cardColor || '#FFFDF8', color: 'inherit', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem', transition: 'all 0.3s' }}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-2xl font-bold">&times;</button>
        </div>
        <div className="flex-1 flex flex-col gap-2 mt-12 md:mt-12">
          {navItems.map(({ name, icon: Icon, path }) => (
            <Link
              key={name}
              to={path}
              className={`flex items-center gap-4 px-8 py-4 rounded-lg font-medium text-lg transition-colors ${location.pathname === path ? 'bg-black/10 font-bold' : 'hover:bg-black/5'}`}
              onClick={() => setOpen(false)}
            >
              <Icon className="w-6 h-6" />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </aside>
      {/* Overlay for mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
    </>
  );
} 