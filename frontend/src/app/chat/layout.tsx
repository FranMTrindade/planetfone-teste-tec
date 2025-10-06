// src/app/chat/layout.tsx

import { ChatProvider } from "@/context/chatContext";


export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
}
