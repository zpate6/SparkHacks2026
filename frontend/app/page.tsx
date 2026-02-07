"use client";
import React, { useState } from 'react';
import { 
  Star, Search, Users, TrendingUp, User, 
  X, Heart, LucideIcon, LogOut 
} from 'lucide-react';

// --- Types ---
type ScreenType = 'login' | 'signup' | 'home' | 'search' | 'connections' | 'chat' | 'analytics' | 'portfolio';

interface Profile {
  id: number;
  name: string;
  role: string;
  emoji: string;
  tags: string[];
}

// --- Mock Data ---
const PROFILES: Profile[] = [
  { id: 1, name: "Sarah Chen", role: "Director", emoji: "👨‍🎬", tags: ["Drama", "Indie", "Documentary"] },
  { id: 2, name: "Marcus Thompson", role: "Producer", emoji: "🎬", tags: ["Action", "Sci-Fi"] },
  { id: 3, name: "Lisa Park", role: "Scriptwriter", emoji: "✍️", tags: ["Comedy", "TV"] },
  { id: 4, name: "Alex Rivera", role: "Actor", emoji: "🎭", tags: ["Theater", "Commercial"] }
];

export default function EntertainmentTinder() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('login');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | ''>('');

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDir(direction);
    setTimeout(() => {
      setSwipeDir('');
      setCardIndex((prev) => (prev + 1) % PROFILES.length);
    }, 300);
  };

  if (activeScreen === 'login' || activeScreen === 'signup') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
          <LoginScreen onLogin={() => setActiveScreen('home')} onSignUp={() => setActiveScreen('signup')} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* --- Desktop Sidebar Navigation --- */}
      <aside className="w-72 bg-[#1a1a1a] border-r border-gray-800 flex flex-col fixed h-full">
        <div className="p-8 bg-gradient-to-br from-red-600 to-red-900">
          <div className="text-4xl mb-2">🎬</div>
          <h1 className="text-xl font-bold tracking-tight">Entertainment <br/> Tinder</h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarItem Icon={Star} label="Discover" active={activeScreen === 'home'} onClick={() => setActiveScreen('home')} />
          <SidebarItem Icon={Search} label="Search" active={activeScreen === 'search'} onClick={() => setActiveScreen('search')} />
          <SidebarItem Icon={Users} label="Network" active={activeScreen === 'connections'} onClick={() => setActiveScreen('connections')} />
          <SidebarItem Icon={TrendingUp} label="Analytics" active={activeScreen === 'analytics'} onClick={() => setActiveScreen('analytics')} />
          <SidebarItem Icon={User} label="My Profile" active={activeScreen === 'portfolio'} onClick={() => setActiveScreen('portfolio')} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => setActiveScreen('login')}
            className="flex items-center gap-3 w-full p-3 text-gray-500 hover:text-red-500 transition-colors rounded-xl hover:bg-red-500/10"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 ml-72 p-10 flex justify-center">
        <div className="w-full max-w-4xl">
           {activeScreen === 'home' ? (
             <DiscoverScreen profile={PROFILES[cardIndex]} swipeDir={swipeDir} onSwipe={handleSwipe} />
           ) : (
             <div className="bg-[#1a1a1a] rounded-3xl p-20 text-center border border-gray-800 mt-20">
               <h2 className="text-3xl font-bold mb-4">Under Construction</h2>
               <p className="text-gray-500">The {activeScreen} dashboard is currently being optimized for desktop.</p>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}

// --- Sidebar Item Component ---

interface SidebarItemProps {
  Icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ Icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-200 group
    ${active ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
  >
    <Icon size={24} className={active ? 'text-white' : 'group-hover:text-red-500'} />
    <span className="font-semibold">{label}</span>
  </button>
);

// --- Login Screen ---

interface LoginProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const LoginScreen: React.FC<LoginProps> = ({ onLogin, onSignUp }) => (
  <div className="flex flex-col h-full">
    <div className="p-10 bg-gradient-to-br from-red-600 to-red-900 text-white text-center">
      <div className="text-5xl mb-4">🎬</div>
      <h1 className="text-2xl font-bold">Welcome Back</h1>
      <p className="text-sm opacity-80">Sign in to your professional network</p>
    </div>
    <div className="p-10 space-y-6 bg-black">
      <InputGroup label="Email Address" placeholder="name@company.com" type="email" />
      <InputGroup label="Password" placeholder="••••••••" type="password" />
      <button onClick={onLogin} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-red-900/20">
        Login
      </button>
      <div className="text-center text-gray-500 text-sm">
        Don't have an account? <button onClick={onSignUp} className="text-red-500 font-bold hover:underline">Sign Up</button>
      </div>
    </div>
  </div>
);

// --- Discover Screen (Desktop Optimized) ---

interface DiscoverProps {
  profile: Profile;
  swipeDir: 'left' | 'right' | '';
  onSwipe: (dir: 'left' | 'right') => void;
}

const DiscoverScreen: React.FC<DiscoverProps> = ({ profile, swipeDir, onSwipe }) => (
  <div className="flex flex-col h-full">
    <div className="mb-8 flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-bold mb-2">Discover Talent</h1>
        <p className="text-gray-500 italic text-lg text-red-500">Connecting you with industry leaders in Los Angeles</p>
      </div>
    </div>

    <div className="relative flex flex-col items-center">
      <div 
        className={`w-full max-w-2xl h-[600px] bg-[#1a1a1a] rounded-[40px] overflow-hidden shadow-2xl border border-gray-800 transition-all duration-300 ease-in-out
        ${swipeDir === 'left' ? '-translate-x-[100px] opacity-0 rotate-[-5deg]' : ''} 
        ${swipeDir === 'right' ? 'translate-x-[100px] opacity-0 rotate-[5deg]' : ''}`}
      >
        <div className="h-3/5 bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-9xl select-none">
          {profile.emoji}
        </div>
        <div className="p-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-bold mb-2">{profile.name}</h2>
              <div className="text-red-500 text-xl font-semibold mb-6 tracking-wide uppercase italic">{profile.role}</div>
            </div>
            <div className="flex gap-4">
               {/* Desktop specific: Added labels for buttons */}
               <button onClick={() => onSwipe('left')} className="p-4 rounded-2xl bg-gray-800 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl">
                 <X size={32} />
               </button>
               <button onClick={() => onSwipe('right')} className="p-4 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-xl">
                 <Heart size={32} fill="currentColor" />
               </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {profile.tags.map(tag => (
              <span key={tag} className="px-5 py-2 bg-black text-gray-400 text-xs uppercase font-black rounded-full border border-gray-800 tracking-tighter">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Keyboard Hints (Desktop UX) */}
      <p className="mt-8 text-gray-600 text-sm flex gap-4">
        <span>Press <kbd className="bg-gray-800 px-2 py-1 rounded">←</kbd> to skip</span>
        <span>Press <kbd className="bg-gray-800 px-2 py-1 rounded">→</kbd> to connect</span>
      </p>
    </div>
  </div>
);

// --- Input Component ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputGroup: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">{label}</label>
    <input 
      {...props} 
      className="bg-[#1a1a1a] border-2 border-gray-800 rounded-2xl p-4 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-700" 
    />
  </div>
);