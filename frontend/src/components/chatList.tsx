// src/components/ChatList.tsx
'use client';

import { useChat } from '@/context/chatContext';
import { Divider, Spin } from 'antd';
import dayjs from 'dayjs';
import { ChatMessage } from './chatMessage';

export function ChatList() {
  const { messages, isLoading } = useChat();

  if (isLoading) return <Spin className="flex justify-center mt-10" />;

  const grouped = messages.reduce((acc: any, msg: any) => {
    const day = dayjs(msg.timestamp).format('DD/MM/YYYY');
    acc[day] = acc[day] || [];
    acc[day].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-4">
      {Object.keys(grouped).map((day) => (
        <div key={day}>
          <Divider plain>
            {day === dayjs().format('DD/MM/YYYY') ? 'Hoje' : day}
          </Divider>
          {grouped[day].map((msg: any) => (
            <ChatMessage key={msg.id}  />
          ))}
        </div>
      ))}
    </div>
  );
}
