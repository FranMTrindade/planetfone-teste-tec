'use client';

import { useAuth } from '@/context/authContext';
import { Modal, Avatar, Button } from 'antd';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ open, onClose }: Props) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials =
    user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-col items-center gap-3">
        <Avatar size={64} className="bg-blue-600">
          {initials}
        </Avatar>
        <h3 className="text-lg font-medium">{user.name}</h3>
        <p className="text-gray-500 text-sm">{user.email}</p>
        <Button
          danger
          type="primary"
          onClick={() => {
            logout();
            onClose();
          }}
        >
          Sair
        </Button>
      </div>
    </Modal>
  );
}
