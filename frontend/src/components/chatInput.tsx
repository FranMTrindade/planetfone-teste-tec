'use client';
import {
  Input,
  Button,
  Modal,
  List,
  Empty,
  Spin,
  Tooltip,
  Image,
  Typography,
} from 'antd';
import {
  SendOutlined,
  PlusOutlined,
  FileOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useChat } from '@/context/chatContext';

const { Text } = Typography;

interface ChatInputProps {
  files: any[];
  loadingFiles: boolean;
}

export function ChatInput({ files, loadingFiles }: ChatInputProps) {
  const { inputValue, setInputValue, sendMessage, loading } = useChat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const maxChars = 200;
  const remainingChars = maxChars - inputValue.length;

  const handleSend = (file?: any) => {
    if (inputValue?.length > maxChars) return;

    const isFileMessage = !!file;
    const messageData = {
      content: isFileMessage ? file.url : inputValue,
      type: isFileMessage ? 'file' : 'text',
      timestamp: new Date(),
      fileId: isFileMessage ? file.id : null,
    };

    sendMessage.mutate(messageData);
    setInputValue('');
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col gap-1 p-3 border-t bg-white">
      <div className="flex items-center gap-2">
        <Tooltip title="Selecionar arquivo existente">
          <Button icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} />
        </Tooltip>

        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite uma mensagem..."
          onPressEnter={() => handleSend()}
          maxLength={maxChars}
        />

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => handleSend()}
          loading={loading}
          disabled={!inputValue.trim() && !selectedFile}
        />
      </div>

      {/* Contador */}
      <div className="flex justify-end pr-1">
        <Text
          type={remainingChars < 0 ? 'danger' : 'secondary'}
          className="text-xs"
        >
          {remainingChars < 0
            ? 'Limite excedido'
            : `${remainingChars} caracteres restantes`}
        </Text>
      </div>

      {/* Modal de seleção */}
      <Modal
        title="Selecione um arquivo para enviar"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        {loadingFiles ? (
          <Spin className="flex justify-center" />
        ) : files?.length === 0 ? (
          <Empty description="Nenhum arquivo disponível" />
        ) : (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={files}
            renderItem={(file: any) => (
              <List.Item
                className={`cursor-pointer rounded-md p-3 border transition-all ${
                  selectedFile?.id === file.id
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setSelectedFile(file);
                  handleSend(file);
                }}
              >
                {/* Preview dinâmico */}
                <div className="flex flex-col items-center gap-2">
                  {file.type === 'image' ? (
                    <Image
                      src={file.url}
                      alt={file.filename}
                      width={150}
                      height={150}
                      className="rounded-md object-cover"
                      preview={true}
                    />
                  ) : file.type === 'audio' ? (
                    <audio
                      controls
                      src={file.url}
                      className="w-full mt-2"
                      style={{ height: '40px' }}
                    />
                  ) : file.filename.endsWith('.pdf') ||
                    file.type === 'document' ? (
                    <iframe
                      src={file.url}
                      className="w-full h-40 border rounded-md"
                      title={file.filename}
                    />
                  ) : (
                    <FileOutlined className="text-4xl text-gray-400" />
                  )}

                  <div className="text-center">
                    <p className="m-0 text-sm font-medium truncate max-w-[180px]">
                      {file.filename}
                    </p>
                    <p className="m-0 text-xs text-gray-500">{file.type}</p>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
}
