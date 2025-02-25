import React, { useState, useEffect } from 'react';
import './styles.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/files`);
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      setError('Error fetching files');
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('Please upload a ZIP file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      await fetchFiles();
    } catch (error) {
      setError('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="warning-banner">
        ⚠️ WARNING: This application provides NO SECURITY. Anyone can upload and download files. Do not share sensitive data! ⚠️
      </div>

      <h1>ZIP File Uploader</h1>

      <div className="upload-section">
        <input
          type="file"
          accept=".zip"
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <p>Uploading...</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="files-section">
        <h2>Uploaded Files</h2>
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              <span>{file.filename}</span>
              <span className="file-date">
                {new Date(file.uploadDate).toLocaleString()}
              </span>
              <a
                href={`${API_URL}/api/files/${file.filename}`}
                className="download-button"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
