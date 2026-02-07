export type ScreenType = 'login' | 'signup' | 'home' | 'search' | 'connections' | 'chat' | 'analytics' | 'portfolio';

export interface Profile {
  id: number;
  name: string;
  role: string;
  emoji: string;
  tags: string[];
}