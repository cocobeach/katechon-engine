import { create } from 'zustand';

export interface MapEvent {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  date: string;
  source: string;
  tier: number;
  pillarImpacts: {
    economy: number;
    spirituality: number;
    family: number;
    education: number;
    media: number;
    legal: number;
  };
  analysis?: string;
  feedUrl?: string;
  link?: string;
}

export interface Minister {
  id: string;
  name: string;
  avatar: string;
  pillar: string;
  active: boolean;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'minister';
  content: string;
  minister?: string;
  timestamp: number;
}

export interface RSSFeed {
  url: string;
  name: string;
  category: string;
  enabled: boolean;
  color: string;
}

interface AppState {
  // Map state
  mapEvents: MapEvent[];
  selectedEvent: MapEvent | null;
  
  // Ministers
  ministers: Minister[];
  activeMinisterIds: string[];
  
  // Chat
  chatMessages: ChatMessage[];
  
  // RSS Feeds
  rssFeeds: RSSFeed[];
  
  // Pillars health
  pillarsHealth: {
    economy: number;
    spirituality: number;
    family: number;
    education: number;
    media: number;
    legal: number;
  };
  
  // Settings
  ollamaUrl: string;
  ollamaModel: string;
  stripePublicKey: string;
  
  // UI state
  currentTab: 'map' | 'persona-studio';
  sidebarCollapsed: boolean;
  
  // Actions
  addMapEvent: (event: MapEvent) => void;
  setSelectedEvent: (event: MapEvent | null) => void;
  toggleMinister: (ministerId: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  updatePillarHealth: (pillar: string, delta: number) => void;
  setCurrentTab: (tab: 'map' | 'persona-studio') => void;
  toggleSidebar: () => void;
  addRSSFeed: (feed: RSSFeed) => void;
  toggleRSSFeed: (url: string) => void;
  updateSettings: (settings: Partial<{ ollamaUrl: string; ollamaModel: string; stripePublicKey: string }>) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  mapEvents: [],
  selectedEvent: null,
  
  ministers: [
    { id: 'economist', name: 'The Economist', avatar: '💰', pillar: 'economy', active: false, color: '#FFD700' },
    { id: 'judge', name: 'The Judge', avatar: '⚖️', pillar: 'legal', active: false, color: '#4169E1' },
    { id: 'scholar', name: 'The Scholar', avatar: '📚', pillar: 'education', active: false, color: '#9370DB' },
    { id: 'guardian', name: 'The Guardian', avatar: '🛡️', pillar: 'family', active: false, color: '#FF69B4' },
    { id: 'journalist', name: 'The Journalist', avatar: '📰', pillar: 'media', active: false, color: '#FF6347' },
    { id: 'chaplain', name: 'The Chaplain', avatar: '✝️', pillar: 'spirituality', active: false, color: '#87CEEB' },
    { id: 'witness', name: 'The Witness', avatar: '👁️', pillar: 'all', active: false, color: '#FFA500' },
  ],
  
  activeMinisterIds: [],
  chatMessages: [],
  
  rssFeeds: [
    { url: 'https://www.zerohedge.com/rss/all', name: 'ZeroHedge', category: 'Alternative', enabled: true, color: '#FF0000' },
    { url: 'https://thegrayzone.com/feed/', name: 'The Grayzone', category: 'Alternative', enabled: true, color: '#808080' },
    { url: 'https://unlimitedhangout.com/feed/', name: 'Unlimited Hangout', category: 'Alternative', enabled: true, color: '#800080' },
    { url: 'https://www.globalresearch.ca/feed', name: 'Global Research', category: 'Alternative', enabled: true, color: '#008000' },
    { url: 'https://brownstone.org/feed/', name: 'Brownstone Institute', category: 'Alternative', enabled: true, color: '#8B4513' },
    { url: 'https://antiwar.com/feed/', name: 'Antiwar.com', category: 'Alternative', enabled: true, color: '#FF4500' },
    { url: 'https://www.reuters.com/rssFeed/worldNews', name: 'Reuters World', category: 'Mainstream', enabled: true, color: '#FF8C00' },
    { url: 'https://www.federalregister.gov/rss/documents.xml', name: 'Federal Register', category: 'Government', enabled: true, color: '#0000FF' },
  ],
  
  pillarsHealth: {
    economy: 50,
    spirituality: 50,
    family: 50,
    education: 50,
    media: 50,
    legal: 50,
  },
  
  ollamaUrl: 'http://127.0.0.1:11434',
  ollamaModel: 'llama2',
  stripePublicKey: '',
  
  currentTab: 'map',
  sidebarCollapsed: false,
  
  // Actions
  addMapEvent: (event) => set((state) => ({
    mapEvents: [...state.mapEvents, event],
  })),
  
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  toggleMinister: (ministerId) => set((state) => ({
    activeMinisterIds: state.activeMinisterIds.includes(ministerId)
      ? state.activeMinisterIds.filter(id => id !== ministerId)
      : [...state.activeMinisterIds, ministerId],
  })),
  
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
  })),
  
  clearChat: () => set({ chatMessages: [] }),
  
  updatePillarHealth: (pillar, delta) => set((state) => ({
    pillarsHealth: {
      ...state.pillarsHealth,
      [pillar]: Math.max(0, Math.min(100, state.pillarsHealth[pillar as keyof typeof state.pillarsHealth] + delta)),
    },
  })),
  
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  addRSSFeed: (feed) => set((state) => ({
    rssFeeds: [...state.rssFeeds, feed],
  })),
  
  toggleRSSFeed: (url) => set((state) => ({
    rssFeeds: state.rssFeeds.map(feed =>
      feed.url === url ? { ...feed, enabled: !feed.enabled } : feed
    ),
  })),
  
  updateSettings: (settings) => set((state) => ({
    ...state,
    ...settings,
  })),
}));
