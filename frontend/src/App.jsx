import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/files`)
      setFiles(response.data)
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.size > 10 * 1024 * 1024) {
      setUploadStatus('File size must be less than 10MB')
      return
    }
    setSelectedFile(file)
    setUploadStatus('')
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file')
      return
    }

    if (!selectedFile.name.endsWith('.zip')) {
      setUploadStatus('Please select a ZIP file')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      setIsUploading(true)
      await axios.post(`${API_URL}/api/upload`, formData)
      setUploadStatus('File uploaded successfully')
      setSelectedFile(null)
      fetchFiles()
    } catch (error) {
      setUploadStatus(error.response?.data?.error || 'Error uploading file')
      console.error('Error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = async (fileId) => {
    try {
      window.open(`${API_URL}/api/download/${fileId}`)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  return (
    <div className="App">
      <h1>ZIP File Manager</h1>

      <div className="upload-section">
        <input
          type="file"
          accept=".zip"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
        {uploadStatus && <p className={uploadStatus.includes('success') ? 'success' : 'error'}>{uploadStatus}</p>}
      </div>

      <div className="files-section">
        <h2>Uploaded Files</h2>
        {files.length === 0 ? (
          <p>No files uploaded yet</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file._id}>
                <span>{file.filename}</span>
                <button onClick={() => handleDownload(file._id)}>
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
