import React, { useEffect, useState } from 'react';
import FileUploadZone from './components/FileUploadZone';
import FileList from './components/FileList';
import { uploadFile, downloadFile, getFiles, FileData } from './lib/api';

function App() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [downloadingFiles, setDownloadingFiles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const fileList = await getFiles();
      setFiles(fileList);
    } catch (err) {
      setError('Failed to load files');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const uploadedFile = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      setFiles(prev => [...prev, uploadedFile]);
      setIsUploading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsUploading(false);
    }
  };

  const handleDownload = async (fileId: string) => {
    setDownloadingFiles(prev => ({ ...prev, [fileId]: true }));
    setError('');

    try {
      await downloadFile(fileId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDownloadingFiles(prev => ({ ...prev, [fileId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">File Sharing App</h1>
        <FileUploadZone
          onFileUpload={handleFileUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          error={error}
        />
        <div className="mt-8">
          <FileList
            files={files.map(file => ({
              ...file,
              downloading: downloadingFiles[file.id] || false
            }))}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
