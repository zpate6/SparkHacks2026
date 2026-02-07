import { Star, Search, Users, TrendingUp, User, LogOut } from 'lucide-react';
import { ScreenType } from '@/types';

export const Sidebar = ({ active, onNavigate }: { active: ScreenType, onNavigate: (s: ScreenType) => void }) => (
  <aside className="w-72 bg-[#1a1a1a] border-r border-gray-800 flex flex-col fixed h-full z-10">
    <div className="p-8 bg-gradient-to-br from-red-600 to-red-900">
      <div className="text-4xl mb-2">🎬</div>
      <h1 className="text-xl font-bold tracking-tight">Entertainment Tinder</h1>
    </div>
    <nav className="flex-1 px-4 py-8 space-y-2">
      <SidebarItem Icon={Star} label="Discover" active={active === 'home'} onClick={() => onNavigate('home')} />
      {/* ... Add other items similarly */}
    </nav>
    <div className="p-4 border-t border-gray-800">
      <button onClick={() => onNavigate('login')} className="flex items-center gap-3 w-full p-3 text-gray-500 hover:text-red-500">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  </aside>
);

// Internal helper for Sidebar
const SidebarItem = ({ Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all ${active ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
  >
    <Icon size={24} />
    <span className="font-semibold">{label}</span>
  </button>
);