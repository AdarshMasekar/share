const API_URL = import.meta.env.VITE_API_URL || 'https://knowshare.onrender.com/api';

export interface FileData {
  id: string;
  name: string;
  uploadDate: string;
}

export const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<FileData> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
};

export const downloadFile = async (fileId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/download/${fileId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Download failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileId.substring(fileId.indexOf('-') + 1);
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const getFiles = async (): Promise<FileData[]> => {
  const response = await fetch(`${API_URL}/files`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch files');
  }

  return response.json();
};
