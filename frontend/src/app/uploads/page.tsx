'use client';

import React, { useState } from 'react';
import { Row, Col, Spin, notification } from 'antd';
import { useDeleteFile, useFiles, useUploadFile } from '@/services/uploads';
import FilePreviewCard from '@/components/filePreviewCard';
import FilePreviewModal from '@/components/filePreviewModal';
import UploadButton from '@/components/uploadButton';
import { useProtectedRoute } from '@/hooks/useAuth';


export default function UploadPage() {
  useProtectedRoute();
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const { data: files, isLoading, isError } = useFiles();
  const uploadMutation = useUploadFile();
  const deleteMutation = useDeleteFile();


  const handleUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync(file);
      api.success({
        message: 'Upload concluído',
        description: `"${file.name}" foi enviado com sucesso.`,
        placement: 'topRight',
      });
    } catch (err: any) {
      console.error(err);
      api.error({
        message: 'Falha no upload',
        description: err?.response?.data?.message || `Erro ao enviar "${file.name}".`,
        placement: 'topRight',
      });
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      api.success({
        message: 'Arquivo removido',
        description: 'O arquivo foi excluído com sucesso.',
        placement: 'topRight',
      });
    } catch (err: any) {
      console.error(err);
      api.error({
        message: 'Erro ao excluir arquivo',
        description: err?.response?.data?.message || 'Não foi possível excluir o arquivo.',
        placement: 'topRight',
      });
      throw err; 
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Carregando arquivos..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Erro ao carregar os arquivos.
      </div>
    );
  }

  return (
    <div className="p-6">
      {contextHolder}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Uploads</h2>
        <UploadButton onUpload={handleUpload} />
      </div>

      {files?.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Nenhum arquivo enviado ainda.
        </p>
      ) : (
        <Row gutter={[16, 16]}>
          {files?.map((file: any) => (
            <Col xs={24} sm={12} md={8} lg={6} key={file.id}>
              <FilePreviewCard
                file={file}
                onSelect={setSelectedFile}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}

      <FilePreviewModal
        open={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        file={selectedFile}
      />
    </div>
  );
}
