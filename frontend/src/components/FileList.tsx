import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Download } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  uploadDate: string;
  downloading?: boolean;
  progress?: number;
}

interface FileListProps {
  files?: FileItem[];
  onDownload?: (fileId: string) => void;
}

const FileList = ({
  files = [
    {
      id: "1",
      name: "example1.zip",
      uploadDate: "2024-03-20",
      downloading: false,
    },
    {
      id: "2",
      name: "example2.zip",
      uploadDate: "2024-03-19",
      downloading: true,
      progress: 45,
    },
    {
      id: "3",
      name: "example3.zip",
      uploadDate: "2024-03-18",
      downloading: false,
    },
  ],
  onDownload = () => {},
}: FileListProps) => {
  return (
    <div className="w-full max-w-[800px] mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Uploaded Files</h2>
      <div className="space-y-3">
        {files.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(file.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {file.downloading && (
                  <div className="w-32">
                    <Progress
                      value={file.progress}
                      className="w-full bg-secondary"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(file.id)}
                  disabled={file.downloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {file.downloading ? "Downloading..." : "Download"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No files have been uploaded yet
        </div>
      )}
    </div>
  );
};

export default FileList;
