import type {
  User,
  Interview,
  HealthResponse,
  PingResponse,
  PromptsConfiguration,
  ConversationStage,
  Prompt,
  Coach,
  SystemStatus,
} from '../types/api';

export class ApiClient {
  private baseUrl: string;
  private botHealthUrl: string;

  constructor(
    baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:3000',
    botHealthUrl: string = import.meta.env.VITE_BOT_HEALTH_URL || 'http://localhost:3002'
  ) {
    this.baseUrl = baseUrl;
    this.botHealthUrl = botHealthUrl;
    console.info(`API Client configured: API=${this.baseUrl}, BotHealth=${this.botHealthUrl}`);
  }

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn(`Main API server not available at ${this.baseUrl}${endpoint}`);
      } else {
        console.error(`API Error for ${endpoint}:`, error);
      }
      throw error;
    }
  }

  private async makeBotHealthRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.botHealthUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response, got ${contentType}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.debug(`Bot health server not available at ${this.botHealthUrl}${endpoint}`);
      } else {
        console.error(`Bot Health API Error for ${endpoint}:`, error);
      }
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    const response = await this.makeRequest<{ users: User[] }>('/api/users');
    return response.users;
  }

  async getUserSessions(email: string): Promise<Interview[]> {
    try {
      const response = await this.makeRequest<any>(
        `/api/interviews?email=${encodeURIComponent(email)}`
      );
      
      // Check if response has results array
      if (response && response.results && Array.isArray(response.results)) {
        // Map API WellnessSession to Interview format
        return response.results.map((session: any) => ({
          id: session.id,
          user_id: session.user_id,
          email: session.user_id,
          created_at: session.created_at,
          updated_at: session.updated_at,
          transcription: session.transcription,
          summary: session.summary,
          bot_conversation: session.bot_conversation,
          analysis_results: session.analysis_results,
          wellness_data: session.wellness_data,
        }));
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch user sessions:', error);
      return [];
    }
  }

  async getInterviews(email?: string): Promise<Interview[]> {
    if (email) {
      return this.getUserSessions(email);
    }
    // Get all interviews
    try {
      const users = await this.getUsers();
      const allInterviews: Interview[] = [];
      
      for (const user of users) {
        try {
          const interviews = await this.getUserSessions(user.email);
          allInterviews.push(...interviews);
        } catch (error) {
          continue;
        }
      }
      return allInterviews;
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      return [];
    }
  }

  async getSession(sessionId: string): Promise<Interview> {
    try {
      // Get all interviews and find the one we need
      const interviews = await this.getInterviews();
      const session = interviews.find(i => i.id === sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      return session;
    } catch (error) {
      console.error('Failed to fetch session:', error);
      throw error;
    }
  }

  async deleteSession(sessionId: string, userEmail?: string): Promise<void> {
    try {
      await this.makeRequest(`/api/interviews/${sessionId}`, {
        method: 'DELETE',
        body: userEmail ? JSON.stringify({ email: userEmail }) : undefined,
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }
  }

  async deleteAllUserSessions(email: string): Promise<void> {
    try {
      // Get user sessions first
      const interviews = await this.getUserSessions(email);
      
      // Delete each session
      for (const interview of interviews) {
        try {
          await this.deleteSession(interview.id, email);
        } catch (error) {
          console.error(`Failed to delete session ${interview.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to delete all user sessions:', error);
      throw error;
    }
  }

  async getHealth(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>('/api/health');
  }

  async getBotHealth(): Promise<PingResponse> {
    return this.makeBotHealthRequest<PingResponse>('/health');
  }

  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const [serverHealth, botHealth] = await Promise.allSettled([
        this.getHealth(),
        this.getBotHealth(),
      ]);

      return {
        server: serverHealth.status === 'fulfilled',
        bot: botHealth.status === 'fulfilled',
      };
    } catch (error) {
      console.error('Failed to check system status:', error);
      return { server: false, bot: false };
    }
  }

  // Prompts API
  async getPromptsConfiguration(): Promise<PromptsConfiguration> {
    return this.makeRequest<PromptsConfiguration>('/api/prompts/configuration');
  }

  async getStages(): Promise<ConversationStage[]> {
    const response = await this.makeRequest<{ stages: ConversationStage[] }>('/api/prompts/stages');
    return response.stages;
  }

  async createStage(stage: Omit<ConversationStage, 'id'>): Promise<ConversationStage> {
    const response = await this.makeRequest<{ stage: ConversationStage }>('/api/prompts/stages', {
      method: 'POST',
      body: JSON.stringify(stage),
    });
    return response.stage;
  }

  async updateStage(id: string, stage: Partial<ConversationStage>): Promise<ConversationStage> {
    const response = await this.makeRequest<{ stage: ConversationStage }>(
      `/api/prompts/stages/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(stage),
      }
    );
    return response.stage;
  }

  async deleteStage(id: string): Promise<void> {
    await this.makeRequest(`/api/prompts/stages/${id}`, {
      method: 'DELETE',
    });
  }

  async getPrompts(): Promise<Prompt[]> {
    const response = await this.makeRequest<{ prompts: Prompt[] }>('/api/prompts');
    return response.prompts;
  }

  async createPrompt(prompt: Omit<Prompt, 'id'>): Promise<Prompt> {
    const response = await this.makeRequest<{ prompt: Prompt }>('/api/prompts', {
      method: 'POST',
      body: JSON.stringify(prompt),
    });
    return response.prompt;
  }

  async updatePrompt(id: string, prompt: Partial<Prompt>): Promise<Prompt> {
    const response = await this.makeRequest<{ prompt: Prompt }>(`/api/prompts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prompt),
    });
    return response.prompt;
  }

  async deletePrompt(id: string): Promise<void> {
    await this.makeRequest(`/api/prompts/${id}`, {
      method: 'DELETE',
    });
  }

  // Coaches API
  async getCoaches(): Promise<Coach[]> {
    const response = await this.makeRequest<{ coaches: Coach[] }>('/api/coaches');
    return response.coaches;
  }

  async createCoach(coach: Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>): Promise<Coach> {
    const response = await this.makeRequest<{ coach: Coach }>('/api/coaches', {
      method: 'POST',
      body: JSON.stringify(coach),
    });
    return response.coach;
  }

  async updateCoach(id: string, coach: Partial<Coach>): Promise<Coach> {
    const response = await this.makeRequest<{ coach: Coach }>(`/api/coaches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coach),
    });
    return response.coach;
  }

  async deleteCoach(id: string): Promise<void> {
    await this.makeRequest(`/api/coaches/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
