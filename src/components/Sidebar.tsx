import { Home, Columns } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Compare Documents', icon: Columns, path: '/compare' },
];

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  return (
    <aside className={`h-screen flex flex-col bg-gradient-to-b from-[#6C4EE6] to-[#4B2996] text-white shadow-xl rounded-tl-3xl rounded-bl-3xl w-64 min-w-[16rem] transition-all duration-300`}> 
      <div className="flex-1 flex flex-col gap-2 mt-12">
        {navItems.map(({ name, icon: Icon, path }) => (
          <Link
            key={name}
            to={path}
            className={`flex items-center gap-4 px-8 py-4 rounded-lg font-medium text-lg transition-colors ${location.pathname === path ? 'bg-white/10 font-bold' : 'hover:bg-white/5'}`}
          >
            <Icon className="w-6 h-6" />
            <span>{name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
} 