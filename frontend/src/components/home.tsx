import React, { useState } from "react";
import WarningBanner from "./WarningBanner";
import FileUploadZone from "./FileUploadZone";
import FileList from "./FileList";

interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string;
}

const Home = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: "",
  });

  const handleFileUpload = async (file: File) => {
    // Placeholder for file upload logic
    setUploadState({
      isUploading: true,
      progress: 0,
      error: "",
    });

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadState((prev) => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 100),
      }));
    }, 500);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: "",
      });
    }, 5000);
  };

  const handleDownload = (fileId: string) => {
    // Placeholder for download logic
    console.log(`Downloading file with ID: ${fileId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WarningBanner />
      <div className="container mx-auto py-8 px-4 space-y-8">
        <FileUploadZone
          onFileUpload={handleFileUpload}
          isUploading={uploadState.isUploading}
          uploadProgress={uploadState.progress}
          error={uploadState.error}
        />
        <FileList onDownload={handleDownload} />
      </div>
    </div>
  );
};

export default Home;
