import { api } from './api'; // seu axios baseURL http://localhost:3000
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useFiles() {
  return useQuery({
    queryKey: ['uploads'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const res = await api.get('/uploads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      const res = await api.post('/uploads', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['uploads'] }),
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const token = localStorage.getItem('access_token');
      await api.delete(`/uploads/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['uploads'] }),
  });
}
