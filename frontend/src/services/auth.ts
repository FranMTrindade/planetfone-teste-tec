import { api } from './api';

export const AuthService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),

  logout: async (refresh_token: string) => {
    try {
      const { data } = await api.post('/auth/logout', { refresh_token });
      return data;
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },
};
