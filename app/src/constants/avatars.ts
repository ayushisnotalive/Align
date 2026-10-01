export interface AvatarOption {
  id: string;
  name: string;
  url: string;
  category: 'memoji' | 'illustration' | 'vibe';
}

export const PRESET_AVATARS: AvatarOption[] = [
  {
    id: 'avatar-1',
    name: 'Smart Explorer',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    category: 'memoji'
  },
  {
    id: 'avatar-2',
    name: 'Campus Cool',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    category: 'memoji'
  },
  {
    id: 'avatar-3',
    name: 'Artistic Soul',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    category: 'memoji'
  },
  {
    id: 'avatar-4',
    name: 'Tech Innovator',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    category: 'memoji'
  },
  {
    id: 'avatar-5',
    name: 'Sunny Vibes',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    category: 'memoji'
  },
  {
    id: 'avatar-6',
    name: 'Free Thinker',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    category: 'memoji'
  },
  {
    id: 'avatar-7',
    name: 'Creative Spirit',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    category: 'illustration'
  },
  {
    id: 'avatar-8',
    name: 'Night Owl',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    category: 'illustration'
  }
];

export const DEFAULT_AVATAR = PRESET_AVATARS[0].url;
