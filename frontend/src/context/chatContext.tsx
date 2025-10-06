'use client';
import { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { chatService } from '@/services/chat';

const ChatContext = createContext<any>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['messages'],
    queryFn: chatService.getMessages,
    refetchInterval: 5000, 
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const sendMessage = useMutation({
    mutationFn: chatService.sendMessage,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] }); 
      setInputValue('');
      setSelectedFile(null);
      setLoading(false);
    },
    onError: (err: any) => {
      console.error(err);
      message.error('Erro ao enviar mensagem');
      setLoading(false);
    },
  });

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        refetchMessages: refetch, // se quiser chamar manualmente
        inputValue,
        setInputValue,
        selectedFile,
        setSelectedFile,
        sendMessage,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
