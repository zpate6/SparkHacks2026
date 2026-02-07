import { useState, useCallback } from 'react';
import { Profile } from '@/types';



export const useDiscovery = () => {
   const PROFILES: Profile[] = [
  { id: 1, name: "Sarah Chen", role: "Director", emoji: "👨‍🎬", tags: ["Drama", "Indie", "Documentary"] },
  { id: 2, name: "Marcus Thompson", role: "Producer", emoji: "🎬", tags: ["Action", "Sci-Fi"] },
  { id: 3, name: "Lisa Park", role: "Scriptwriter", emoji: "✍️", tags: ["Comedy", "TV"] },
  { id: 4, name: "Alex Rivera", role: "Actor", emoji: "🎭", tags: ["Theater", "Commercial"] }
   ];
  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | ''>('');

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    setSwipeDir(direction);
    setTimeout(() => {
      setSwipeDir('');
      setCardIndex((prev) => (prev + 1) % PROFILES.length);
    }, 300);
  }, []);

  return {
    currentProfile: PROFILES[cardIndex],
    swipeDir,
    handleSwipe
  };
};