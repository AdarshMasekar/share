import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";

interface FileUploadZoneProps {
  onFileUpload?: (file: File) => Promise<void>;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

const FileUploadZone = ({
  onFileUpload = async () => {},
  isUploading = false,
  uploadProgress = 0,
  error = "",
}: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === "application/zip") {
        await onFileUpload(file);
      }
    },
    [onFileUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div
        {...getRootProps()}
        className={`
          relative
          h-[300px]
          border-2
          border-dashed
          rounded-lg
          transition-colors
          duration-200
          flex
          flex-col
          items-center
          justify-center
          cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
        `}
      >
        <input {...getInputProps()} />
        <Upload
          className={`w-12 h-12 mb-4 ${isDragActive ? "text-blue-500" : "text-gray-400"}`}
        />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drag and drop your ZIP file here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to select a file (max 50MB)
        </p>
        <Button variant="outline" disabled={isUploading}>
          Select File
        </Button>

        {isUploading && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center mt-2 text-gray-600">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUploadZone;
