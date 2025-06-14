// src/components/FileUploadButton.tsx
"use client";

import { useGetAuthUserQuery } from '@/state/api';
import { useRef } from 'react';

const FileUploadButton = ({ chatId }: { chatId: number }) => {
  const { data: authUser } = useGetAuthUserQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/chats/${chatId}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authUser?.cognitoInfo?.idToken}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('File upload failed');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        📎
      </button>
    </>
  );
};

export default FileUploadButton;