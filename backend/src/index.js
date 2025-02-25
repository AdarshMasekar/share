const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI);

// GridFS setup
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Storage configuration
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    if (file.mimetype !== 'application/zip') {
      return null;
    }
    return {
      filename: file.originalname,
      bucketName: 'uploads'
    };
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a ZIP file' });
  }
  res.json({ file: req.file });
});

app.get('/api/files', async (req, res) => {
  try {
    const files = await gfs.files.find().toArray();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching files' });
  }
});

app.get('/api/files/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    const readStream = gfs.createReadStream(file.filename);
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Error downloading file' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
