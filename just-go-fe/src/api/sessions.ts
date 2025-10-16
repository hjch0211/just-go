import { apiClient } from './client';
import type { Session, SessionsResponse, RRWebEvent } from '../types';

export const sessionsApi = {
  getByProject: async (
    projectId: string,
    limit = 50,
    skip = 0
  ): Promise<SessionsResponse> => {
    const response = await apiClient.get<SessionsResponse>('/sessions', {
      params: { projectId, limit, skip },
    });
    return response.data;
  },

  getOne: async (sessionId: string): Promise<Session> => {
    const response = await apiClient.get<Session>(`/sessions/${sessionId}`);
    return response.data;
  },

  getEvents: async (sessionId: string): Promise<{ events: RRWebEvent[] }> => {
    const response = await apiClient.get<{ events: RRWebEvent[] }>(
      `/sessions/${sessionId}/events`
    );
    return response.data;
  },
};
