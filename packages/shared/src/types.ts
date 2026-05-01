// AI
export type ArtistRole = 'tutor' | 'guide' | 'critic' | 'freestyle';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  messages: ChatMessage[];
  artistRole: ArtistRole;
  sessionContext?: string;
}

export interface ChatResponse {
  message: string;
  sessionContext?: string;
}

// User
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
  artistRole?: ArtistRole;
}

// Gallery
export interface ArtworkEntry {
  id: string;
  uid: string;
  title: string;
  storageUrl: string;
  thumbnailUrl: string;
  createdAt: number;
  tags: string[];
  emotionalIntent?: string;
}

// API responses
export interface ApiError {
  error: string;
  code?: string;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: number;
  version: string;
}
