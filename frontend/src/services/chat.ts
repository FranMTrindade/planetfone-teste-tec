import { api } from '@/services/api';

export const chatService = {
  async getMessages() {
    const res = await api.get('/messages');
    return res.data;
  },

  async sendMessage(newMessage: any) {
    const res = await api.post('/messages', newMessage);
    return res.data;
  },
};
