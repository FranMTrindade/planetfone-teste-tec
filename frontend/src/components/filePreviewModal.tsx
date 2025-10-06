'use client';

import { Modal } from 'antd';
import {
  FilePdfOutlined,
  AudioOutlined,
  FileOutlined,
} from '@ant-design/icons';

interface Props {
  open: boolean;
  onClose: () => void;
  file: any | null;
}

export default function FilePreviewModal({ open, onClose, file }: Props) {
  if (!file) return null;

  const renderPreview = () => {
    if (file.type === 'image') {
      return (
        <img
          src={file.url}
          alt={file.filename}
          className="max-h-[80vh] w-auto mx-auto rounded-lg shadow-lg"
        />
      );
    }

    if (file.type === 'audio') {
      return (
        <div className="flex flex-col items-center gap-3 py-6">
          <audio controls src={file.url} className="w-full max-w-md" />
        </div>
      );
    }

    if (file.type === 'document' || file.filename.endsWith('.pdf')) {
      return (
        <iframe
          src={file.url}
          title={file.filename}
          className="w-full h-[80vh] rounded-lg border-none"
        />
      );
    }

    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <FileOutlined className="text-5xl text-gray-500" />
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Abrir arquivo
        </a>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="80vw"
      title={file.filename}
    >
      {renderPreview()}
    </Modal>
  );
}
