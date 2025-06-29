import { Home, FileText, Columns, List } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Compare Documents', icon: Columns, path: '/compare' },
  { name: 'Extracted Text', icon: FileText, path: '/extracted' },
  { name: 'Summary', icon: List, path: '/summary' },
];

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  return (
    <aside className={`bg-gradient-to-b from-indigo-900 to-indigo-800 text-white h-full flex flex-col transition-all duration-300 ${open ? 'w-56' : 'w-16'} shadow-lg`}> 
      <button className="md:hidden p-2 self-end" onClick={() => setOpen(o => !o)}>
        <span className="sr-only">Toggle menu</span>
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="18" height="2" rx="1"/><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="3" y="18" width="18" height="2" rx="1"/></svg>
      </button>
      <nav className="flex-1 flex flex-col gap-2 mt-8">
        {navItems.map(({ name, icon: Icon, path }) => (
          <Link
            key={name}
            to={path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-colors ${location.pathname === path ? 'bg-indigo-700 font-bold' : 'hover:bg-indigo-600'}`}
          >
            <Icon className="w-5 h-5" />
            {open && <span className="ml-2">{name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 