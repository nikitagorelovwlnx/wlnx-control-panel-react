// API data types for WLNX Control Panel

export interface User {
  email: string;
  session_count: number;
  last_session: string;
  first_session: string;
  sessions?: Interview[];
}

export interface ChatMessage {
  id: string;
  interviewId: string;
  sender: 'user' | 'interviewer';
  content: string;
  timestamp: string;
  senderName?: string;
}

export interface InterviewSummary {
  id: string;
  interviewId: string;
  userId: string;
  summary: string;
  keyPoints: string[];
  rating?: number;
  duration?: number;
  createdAt: string;
}

export interface WellnessData {
  age?: number;
  weight?: number;
  height?: number;
  stress_level?: number;
  sleep_hours?: number;
  activity_level?: string;
  goals?: string[];
  [key: string]: unknown;
}

export interface Interview {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  transcription: string;
  summary: string;
  bot_conversation?: string;
  analysis_results?: unknown;
  wellness_data?: WellnessData;
  email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  timestamp: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    openai: ServiceStatus;
    api: ServiceStatus;
    telegram: ServiceStatus;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'unknown';
  responseTime?: number;
  error?: string;
}

export interface PingResponse {
  status: 'ok';
  timestamp: string;
}

export interface ConversationStage {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface Prompt {
  id: string;
  stageId: string;
  content: string;
  order: number;
  isActive: boolean;
  description?: string;
}

export interface PromptsConfiguration {
  stages: ConversationStage[];
  prompts: Prompt[];
  lastUpdated: string;
}

export interface Coach {
  id: string;
  name: string;
  description?: string;
  coach_prompt_content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemStatus {
  server: boolean;
  bot: boolean;
}
