// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  domain: string;
}

// Session Types
export interface Session {
  _id: string;
  projectId: string;
  sessionId: string;
  userAgent?: string;
  ip?: string;
  startedAt: string;
  lastActivityAt: string;
  duration: number;
  eventCount: number;
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
  limit: number;
  skip: number;
}

// Event Types
export interface RRWebEvent {
  type: number;
  timestamp: number;
  data: any;
}
