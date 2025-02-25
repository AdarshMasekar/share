const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const mongoURI = 'mongodb://localhost:27017/filesharing';

// Create MongoDB connection
mongoose.connect(mongoURI);
const conn = mongoose.connection;

// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('Connected to MongoDB');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads'
    };
  }
});

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
    const files = await gfs.files.find().toArray();
    const fileList = files.map(file => ({
      id: file.filename,
      name: file.filename.substring(file.filename.indexOf('-') + 1),
      uploadDate: file.uploadDate
    }));
    res.json(fileList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Upload file endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    id: req.file.filename,
    name: req.file.originalname,
    uploadDate: new Date().toISOString()
  });
});

// Download file endpoint
app.get('/api/download/:fileId', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.fileId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename.substring(file.filename.indexOf('-') + 1)}"`,
    });

    const readStream = gfs.createReadStream({ filename: file.filename });
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Error downloading file' });
  }
});

// Delete file endpoint (optional)
app.delete('/api/files/:fileId', async (req, res) => {
  try {
    await gfs.files.deleteOne({ filename: req.params.fileId });
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting file' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  }
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
