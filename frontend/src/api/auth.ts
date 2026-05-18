import apiClient from './client';
import type { ApiResponse, AuthTokenPayload, User, LoginFormData, RegisterFormData } from '../types';

export const authApi = {
  register: (data: Omit<RegisterFormData, 'confirmPassword'>) =>
    apiClient.post<ApiResponse<AuthTokenPayload>>('/auth/register', data),

  login: (data: LoginFormData) =>
    apiClient.post<ApiResponse<AuthTokenPayload>>('/auth/login', data),

  getMe: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),
};
