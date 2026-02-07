"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DiscoveryView } from '@/components/views/DiscoveryView';
import { AuthContainer } from '@/components/views/AuthContainer';
import { useDiscovery } from '@/hooks/useDiscovery';
import { ScreenType } from '@/types';

export default function Page() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('login');
  const { currentProfile, swipeDir, handleSwipe } = useDiscovery();

  if (activeScreen === 'login' || activeScreen === 'signup') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <AuthContainer type={activeScreen} onSuccess={() => setActiveScreen('home')} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar active={activeScreen} onNavigate={setActiveScreen} />
      <main className="flex-1 ml-72 p-10 flex flex-col items-center">
        {activeScreen === 'home' && (
          <DiscoveryView profile={currentProfile} swipeDir={swipeDir} onSwipe={handleSwipe} />
        )}
      </main>
    </div>
  );
}