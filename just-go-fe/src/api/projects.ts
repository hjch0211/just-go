import { apiClient } from './client';
import type { Project, CreateProjectRequest } from '../types';

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/projects');
    return response.data;
  },

  getOne: async (id: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  regenerateApiKey: async (id: string): Promise<Project> => {
    const response = await apiClient.put<Project>(`/projects/${id}/regenerate-api-key`);
    return response.data;
  },
};
