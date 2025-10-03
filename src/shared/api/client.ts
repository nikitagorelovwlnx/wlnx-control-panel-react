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
    try {
      // Try /health endpoint first
      return await this.makeRequest<HealthResponse>('/health');
    } catch (error) {
      // Fallback to /api/users to check if server is alive
      try {
        await this.makeRequest<{ users: User[] }>('/api/users');
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: 0,
          version: 'unknown',
          services: {
            openai: { status: 'unknown' },
            api: { status: 'up' },
            telegram: { status: 'unknown' },
          },
          memory: {
            used: 0,
            total: 0,
            percentage: 0,
          },
        };
      } catch (fallbackError) {
        throw error;
      }
    }
  }

  async getBotHealth(): Promise<PingResponse> {
    try {
      return await this.makeBotHealthRequest<PingResponse>('/health');
    } catch (error) {
      try {
        return await this.makeBotHealthRequest<PingResponse>('/status');
      } catch (statusError) {
        try {
          return await this.makeBotHealthRequest<PingResponse>('/ping');
        } catch (pingError) {
          throw error;
        }
      }
    }
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
    try {
      const response = await this.makeRequest<any>('/api/prompts');
      
      // Transform server data structure to our expected format
      const stages: ConversationStage[] = [];
      const prompts: Prompt[] = [];
      
      if (response && typeof response === 'object') {
        let stageOrder = 1;
        for (const [stageKey, stageData] of Object.entries(response)) {
          if (typeof stageData === 'object' && stageData !== null) {
            // Create stage
            stages.push({
              id: stageKey,
              name: this.formatStageName(stageKey),
              description: `Stage: ${this.formatStageName(stageKey)}`,
              order: stageOrder++
            });

            // Create prompts for this stage
            const stageDataObj = stageData as any;
            if (stageDataObj.question_prompt) {
              prompts.push({
                id: `${stageKey}_question`,
                stageId: stageKey,
                content: stageDataObj.question_prompt,
                order: 1,
                isActive: true,
                description: 'Question Prompt'
              });
            }
            if (stageDataObj.extraction_prompt) {
              prompts.push({
                id: `${stageKey}_extraction`,
                stageId: stageKey,
                content: stageDataObj.extraction_prompt,
                order: 2,
                isActive: true,
                description: 'Extraction Prompt'
              });
            }
          }
        }
      }

      return {
        stages,
        prompts,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch prompts configuration:', error);
      throw error;
    }
  }

  private formatStageName(key: string): string {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async updateStagePrompts(stageId: string, prompts: Prompt[]): Promise<void> {
    try {
      // Transform prompts back to server format
      const stageData: any = {};
      
      prompts.forEach(prompt => {
        if (prompt.description === 'Question Prompt') {
          stageData.question_prompt = prompt.content || '';
        } else if (prompt.description === 'Extraction Prompt') {
          stageData.extraction_prompt = prompt.content || '';
        }
      });

      await this.makeRequest(`/api/prompts/${stageId}`, {
        method: 'PUT',
        body: JSON.stringify(stageData),
      });
    } catch (error) {
      console.error('Failed to update stage prompts:', error);
      throw error;
    }
  }

  async restoreStageDefaults(stageId: string): Promise<void> {
    try {
      // Send empty prompts to restore defaults
      await this.makeRequest(`/api/prompts/${stageId}`, {
        method: 'PUT',
        body: JSON.stringify({
          question_prompt: '',
          extraction_prompt: ''
        }),
      });
    } catch (error) {
      console.error('Failed to restore stage defaults:', error);
      throw error;
    }
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
