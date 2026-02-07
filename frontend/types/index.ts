export type ScreenType = 'login' | 'signup' | 'home' | 'search' | 'connections' | 'chat' | 'analytics' | 'portfolio';

export interface Profile {
  id: number;
  name: string;
  role: string;
  emoji: string;
  tags: string[];
}

// types/user.ts
export interface User {
  id: string;
  status: 'ACTIVE' | 'HIBERNATED';
  createdAt: string; // Dates are typically returned as ISO strings from Spring
  authId: string;
  profileId: string;
  portfolioId: string;
  analyticsId: string;
}