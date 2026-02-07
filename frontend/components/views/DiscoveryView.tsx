import React from 'react';
import { X, Heart } from 'lucide-react';
import { Profile } from '@/types';

interface DiscoveryViewProps {
  profile: Profile;
  swipeDir: 'left' | 'right' | '';
  onSwipe: (direction: 'left' | 'right') => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({ profile, swipeDir, onSwipe }) => {
  return (
    <section className="flex flex-col w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-left">
        <h2 className="text-5xl font-black mb-2 tracking-tighter text-white">Discover Talent</h2>
        <p className="text-red-500 font-medium text-lg italic">Top industry professionals curated for you.</p>
      </div>

      <div className="relative group">
        <div 
          className={`w-full h-[650px] bg-[#1a1a1a] rounded-[40px] overflow-hidden shadow-2xl border border-gray-800 transition-all duration-300 transform-gpu
          ${swipeDir === 'left' ? '-translate-x-32 opacity-0 -rotate-6' : ''} 
          ${swipeDir === 'right' ? 'translate-x-32 opacity-0 rotate-6' : ''}`}
        >
          {/* Avatar Section */}
          <div className="h-[60%] bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-[180px] select-none">
            {profile.emoji}
          </div>
          
          {/* Info Section */}
          <div className="p-10 flex flex-col justify-between h-[40%] bg-[#1a1a1a]">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-4xl font-bold text-white">{profile.name}</h3>
                <p className="text-red-500 text-xl font-bold uppercase italic tracking-wider">
                  {profile.role}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => onSwipe('left')} 
                  aria-label="Pass"
                  className="p-5 rounded-2xl bg-gray-800 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90"
                >
                  <X size={32} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => onSwipe('right')} 
                  aria-label="Connect"
                  className="p-5 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-xl active:scale-90"
                >
                  <Heart size={32} fill="currentColor" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              {profile.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-5 py-2 bg-black text-gray-400 text-[10px] uppercase font-black rounded-full border border-gray-800 tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};