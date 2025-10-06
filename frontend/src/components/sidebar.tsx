'use client';
import { useState } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { baseMenuItems } from '@/utils/menuItens';
import UserProfileModal from './userProfileModal';
import { useRouter, usePathname } from 'next/navigation';



const { Sider } = Layout;

interface AppSidebarProps {
  pathname: string;
  initials: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function Sidebar({
  pathname,
  initials,
  isModalOpen,
  setIsModalOpen,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  


  const menuItems: MenuProps['items'] = baseMenuItems.map((item) => ({
    ...item,
    label: collapsed ? null : item.label,
  }));

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log("clicou", e.key)
    router.push(e.key);
  };

  console.log()

  return (
    <Sider
      width={220}
      collapsedWidth={80}
      collapsible={false}
      breakpoint="lg"
      onBreakpoint={(broken) => setCollapsed(broken)} 
      collapsed={collapsed}
      className="relative flex flex-col h-screen shadow-md transition-all duration-300"
      style={{ backgroundColor: '#f2f2f2' }}
    >
      <div className="flex-1 mt-6">
        {!collapsed && (
          <h2 className="text-center text-lg font-semibold mb-4 text-black-600">
            Planetfone
          </h2>
        )}

        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          className="border-none bg-transparent"
          style={{ backgroundColor: 'transparent' }}
          onClick={handleMenuClick}
        />
      </div>

      <div className="absolute bottom-6 left-0 w-full flex justify-center">
        <Avatar
          size={collapsed ? 40 : 48}
          className="cursor-pointer bg-blue-600 transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          {initials}
        </Avatar>

        <UserProfileModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </Sider>
  );
}
