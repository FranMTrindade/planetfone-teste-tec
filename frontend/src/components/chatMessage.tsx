'use client';
import { Avatar } from 'antd';
import dayjs from 'dayjs';
import { FileOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useChat } from '@/context/chatContext';


export function ChatMessage() {
  const { messages, isLoading, sendMessage } = useChat();



  if (isLoading) return <p className="text-gray-400 text-sm">Carregando mensagens...</p>;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const renderMessageContent = (msg: any) => {
    const isFile = msg.type === 'file';
    const content = msg.content || '';

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(content);
    const isPdf = /\.pdf$/i.test(content);
    const isAudio = /\.(mp3|wav|ogg|opus)$/i.test(content);

    if (!isFile) {
      return <p className="m-0 leading-snug whitespace-pre-wrap break-words">{msg.content}</p>;
    }

    if (isImage) {
      if (isMobile) {
        return (
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => window.open(content, '_blank')}
          >
            <FileOutlined className="text-2xl text-blue-600 mb-1" />
            <span className="text-blue-600 text-sm hover:underline">Ver imagem</span>
          </div>
        );
      }

      return (
        <div className="flex justify-start">
          <img
            src={content}
            alt="preview"
            className="rounded-lg object-contain cursor-pointer"
            style={{
              width: '100%',
              maxWidth: '220px',
              maxHeight: '220px',
              borderRadius: '10px',
              marginLeft: msg.isMine ? 'auto' : '0',
              backgroundColor: '#fff',
            }}
            onClick={() => window.open(content, '_blank')}
          />
        </div>
      );
    }

    if (isAudio) {
      if (isMobile) {
        return (
          <button
            onClick={() => {
              const audio = new Audio(content);
              audio.play();
            }}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full shadow-sm active:scale-95 transition"
          >
            <PlayCircleOutlined />
            <span>Ouvir</span>
          </button>
        );
      }

      return (
        <div className="flex justify-center items-center w-[250px] mt-1">
          <audio
            controls
            controlsList="nodownload"
            className="w-full rounded-md"
            style={{ height: '40px' }}
          >
            <source src={content} />
            Seu navegador não suporta o player de áudio.
          </audio>
        </div>
      );
    }

    if (isPdf) {
      if (isMobile) {
        return (
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => window.open(content, '_blank')}
          >
            <FileOutlined className="text-2xl text-red-500 mb-1" />
            <span className="text-red-500 text-sm hover:underline">Abrir PDF</span>
          </div>
        );
      }

      return (
        <div
          className="cursor-pointer overflow-hidden rounded-md hover:shadow-md transition"
          onClick={() => window.open(content, '_blank')}
        >
          <iframe
            src={content}
            title="PDF Preview"
            className="w-[200px] h-[200px] border-none rounded-md pointer-events-none"
          />
        </div>
      );
    }

    return (
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => window.open(content, '_blank')}
      >
        <FileOutlined className="text-3xl text-blue-600 mb-1" />
        <span className="text-blue-600 hover:underline text-sm">Abrir arquivo</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 p-3 overflow-y-auto">
      {messages.map((msg: any) => (
        <div
          key={msg.id}
          className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} items-end gap-2`}
        >
          {!msg.isMine && (
            <Avatar className="bg-gray-400 text-white text-sm select-none">
              {msg.sender?.slice(0, 2).toUpperCase() || 'US'}
            </Avatar>
          )}

          <div
            className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-3 py-2 shadow-sm break-words ${
              msg.isMine
                ? 'bg-blue-100 text-gray-900 self-end'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}
          >
            {renderMessageContent(msg)}

            <p
              className={`text-[11px] mt-1 ${
                msg.isMine ? 'text-gray-500 text-right' : 'text-gray-400 text-left'
              }`}
            >
              {dayjs(msg.timestamp).format('HH:mm')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
