'use client';

import React from 'react';
import { Card, Flex, Popconfirm, notification } from 'antd';
import {
  AudioOutlined,
  FileOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

interface FilePreviewCardProps {
  file: {
    id: string;
    type: string;
    url: string;
    filename: string;
  };
  onSelect: (file: any) => void;
  onDelete: (id: string) => Promise<void>;
}

const FilePreviewCard: React.FC<FilePreviewCardProps> = ({
  file,
  onSelect,
  onDelete,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const handleClick = () => onSelect(file);

  const handleDelete = async () => {
    try {
      await onDelete(file.id);
      api.success({
        message: 'Arquivo excluído',
        description: `"${file.filename}" foi removido com sucesso.`,
        placement: 'topRight',
      });
    } catch (err) {
      console.error(err);
      api.error({
        message: 'Erro ao excluir',
        description: 'Ocorreu um erro ao excluir o arquivo.',
        placement: 'topRight',
      });
    }
  };

  const renderPreview = () => {
    if (file.type === 'image') {
      return (
        <img
          src={file.url}
          alt={file.filename}
          className="object-cover h-56 w-full transition-transform hover:scale-105 cursor-pointer rounded-t-md"
          onClick={handleClick}
        />
      );
    }

    if (file.type === 'audio') {
      return (
        <Flex
  vertical
  align="center"
  justify="center"
  className="h-56 w-full bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer rounded-t-md"
  onClick={handleClick}
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '14rem', 
  }}
>
  <AudioOutlined style={{ fontSize: 56, color: '#000000' }} />
</Flex>

      );
    }

    if (file.type === 'document' || file.filename.endsWith('.pdf')) {
      return (
        <div
          onClick={handleClick}
          className="cursor-pointer overflow-hidden rounded-t-md hover:shadow-lg transition"
        >
          <iframe
            src={file.url}
            title={file.filename}
            className="w-full h-56 border-none pointer-events-none"
          />
        </div>
      );
    }

    return (
      <Flex
        vertical
        align="center"
        justify="center"
        className="h-56 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer rounded-t-md"
        onClick={handleClick}
      >
        <FileOutlined style={{ fontSize: 40, color: '#9ca3af', marginBottom: 8 }} />
        <span className="text-gray-600 text-sm">Ver arquivo</span>
      </Flex>
    );
  };

  return (
    <>
      {contextHolder}
      <Card
        hoverable
        bordered={false}
        className="overflow-hidden rounded-lg shadow-sm"
        cover={renderPreview()}
        actions={[
          <Popconfirm
            key="delete"
            title="Excluir arquivo"
            description={`Deseja realmente excluir "${file.filename}"?`}
            okText="Sim"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={handleDelete}
          >
            <DeleteOutlined
              className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>,
        ]}
      >
        <Card.Meta
          title={
            <p className="font-semibold text-gray-800 truncate" title={file.filename}>
              {file.filename}
            </p>
          }
          description={<span className="text-gray-400 text-sm">Sem data</span>}
        />
      </Card>
    </>
  );
};

export default FilePreviewCard;
