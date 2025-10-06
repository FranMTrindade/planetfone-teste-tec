'use client';

import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import type { UploadProps } from 'antd';

interface UploadButtonProps {
  onUpload: (file: File) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
  const props: UploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      onUpload(file);
      message.success(`${file.name} adicionado com sucesso`);
      return false;
    },
  };

  return (
    <Upload {...props}>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        className="flex items-center justify-center 
                   sm:px-4 sm:py-2 sm:rounded-md
                   p-2 rounded-full" 
      >
        <span className="hidden sm:inline">Fazer upload</span>
      </Button>
    </Upload>
  );
};

export default UploadButton;
