'use client';

import { Empty, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/context/chatContext';
import { ChatList } from '@/components/chatList';
import { ChatInput } from '@/components/chatInput';
import { useFiles } from '@/services/uploads';

export default function ChatPage() {
  const { messages, isLoading } = useChat();
  const { data: files, isLoading: isLoadingFiles } = useFiles();
    const [prevCount, setPrevCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const isFromOtherUser = !lastMessage.isMine;

    if (messages.length > prevCount && isFromOtherUser) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: prevCount === 0 ? 'auto' : 'smooth',
      });
    }

    setPrevCount(messages.length);
  }, [messages, prevCount]);

  return (
    <div className="flex flex-col h-[90vh] bg-gray-50 rounded-lg shadow-md overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Empty description="Nenhuma mensagem ainda" />
          </div>
        ) : (
          <ChatList />
        )}
      </div>

      <div className="border-t border-gray-200 bg-white p-3">
        <ChatInput files={files} loadingFiles={isLoadingFiles} />
      </div>
    </div>
  );
}
