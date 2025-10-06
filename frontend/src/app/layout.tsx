'use client';

import './globals.css';
import { Layout } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/authContext';
import { Sidebar } from '@/components/sidebar';
import { useRouter, usePathname } from 'next/navigation';



const queryClient = new QueryClient();

function LayoutWithSidebar({ children }: { children: React.ReactNode }) {

  const { user } = useAuth(); // supondo que seu AuthContext tenha { user: { name, email } }
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // esconder sidebar na tela de login
  const hideSidebar = pathname === '/';

  // gerar iniciais
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <Layout className="min-h-screen">
      {!hideSidebar && (
        <Sidebar
          pathname={pathname}
          initials={initials}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
      <Layout.Content className="p-6 bg-gray-50 w-full">
        {children}
      </Layout.Content>
    </Layout>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LayoutWithSidebar>{children}</LayoutWithSidebar>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
