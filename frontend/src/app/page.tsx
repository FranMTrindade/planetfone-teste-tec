'use client';

import { useState } from 'react';
import { Card, Input, Button, Tabs, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth';
import { useAuth } from '@/context/authContext';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === 'login') {
        const { data } = await AuthService.login(form.email, form.password);
        return data;
      } else {
        const { data } = await AuthService.register(
          form.name,
          form.email,
          form.password,
        );
        return data;
      }
    },
    onSuccess: (data) => {
      if (mode === 'login') {
        login(data.access_token);
        message.success('Login realizado com sucesso!');
      } else {
        message.success('Usuário registrado com sucesso!');
        setMode('login');
      }
    },
    onError: (error) => {
      message.error('Erro ao autenticar');
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card
        className="w-full max-w-md shadow-lg rounded-lg"
        title={<h2 className="text-center text-xl font-semibold">Bem-vindo</h2>}
      >
        <Tabs
          activeKey={mode}
          centered
          onChange={(key) => setMode(key as 'login' | 'register')}
          items={[
            { key: 'login', label: 'Login' },
            { key: 'register', label: 'Registrar' },
          ]}
        />

        <div className="flex flex-col gap-3 mt-4">
          {mode === 'register' && (
            <Input
              prefix={<UserOutlined />}
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              size="large"
            />
          )}

          <Input
            prefix={<MailOutlined />}
            placeholder="E-mail"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            size="large"
          />

          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Senha"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            size="large"
          />

          <Button
            type="primary"
            loading={mutation.isPending}
            size="large"
            onClick={() => mutation.mutate()}
            className="w-full mt-2"
          >
            {mode === 'login' ? 'Entrar' : 'Registrar'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
