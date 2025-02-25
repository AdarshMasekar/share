const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

// Enable CORS
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const mongoURI = 'mongodb+srv://adarsh:ltusHNw8fCf6VSHk@cluster0.eowltwt.mongodb.net/filesharing';

// Create MongoDB connection with better error handling
let bucket;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    console.log('GridFS bucket initialized successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Also add error handler for after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error after initial connection:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip') {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'));
    }
  }
});

// Get list of files
app.get('/api/files', async (req, res) => {
  try {
    const files = await bucket.find().toArray();
    const fileList = files.map(file => ({
      id: file.filename,
      name: file.filename.substring(file.filename.indexOf('-') + 1),
      uploadDate: file.uploadDate
    }));
    res.json(fileList);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Upload file endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filename = `${Date.now()}-${req.file.originalname}`;
    const uploadStream = bucket.openUploadStream(filename);

    const buffer = req.file.buffer;
    uploadStream.end(buffer);

    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    res.json({
      id: filename,
      name: req.file.originalname,
      uploadDate: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Download file endpoint
app.get('/api/download/:fileId', async (req, res) => {
  try {
    const file = await bucket.find({ filename: req.params.fileId }).next();
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${file.filename.substring(file.filename.indexOf('-') + 1)}"`,
    });

    const downloadStream = bucket.openDownloadStreamByName(req.params.fileId);
    downloadStream.pipe(res);
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({ error: 'Error downloading file' });
  }
});

// Delete file endpoint
app.delete('/api/files/:fileId', async (req, res) => {
  try {
    const file = await bucket.find({ filename: req.params.fileId }).next();
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    await bucket.delete(file._id);
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  }
  res.status(500).json({ error: err.message });
});

// Start server with error handling
app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}`);
});
