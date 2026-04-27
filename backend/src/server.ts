import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// In-memory storage for hashes (no DB)
const assetHashes = new Map<string, { filename: string; size: number; type: string; hash: string; uploadedAt: Date }>();

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Generate SHA-256 hash
  const fileBuffer = fs.readFileSync(req.file.path);
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  // Store in memory
  assetHashes.set(hash, {
    filename: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype,
    hash,
    uploadedAt: new Date()
  });

  res.json({
    hash,
    filename: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype,
    uploadedAt: new Date().toISOString()
  });
});

app.get('/track/:hash', (req, res) => {
  const { hash } = req.params;

  if (!assetHashes.has(hash)) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Mock tracking data
  const mockPlatforms = ['YouTube', 'Instagram', 'Twitter', 'Facebook', 'TikTok', 'Reddit'];
  const mockSites = ['sportsnews.com', 'fanforum.net', 'socialmedia.example', 'blog.example'];

  const detections = Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => ({
    platform: Math.random() > 0.5 ? mockPlatforms[Math.floor(Math.random() * mockPlatforms.length)] : mockSites[Math.floor(Math.random() * mockSites.length)],
    url: `https://${Math.random().toString(36).substring(7)}.com/post/${Math.floor(Math.random() * 10000)}`,
    confidence: Math.floor(Math.random() * 40) + 60, // 60-99%
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
    status: Math.random() > 0.7 ? 'Unauthorized' : 'Authorized'
  }));

  res.json({
    hash,
    detections,
    totalDetections: detections.length,
    unauthorizedCount: detections.filter(d => d.status === 'Unauthorized').length
  });
});

app.post('/verify', (req, res) => {
  const { hash } = req.body;

  if (!hash) {
    return res.status(400).json({ error: 'Hash is required' });
  }

  const exists = assetHashes.has(hash);
  res.json({
    hash,
    verified: exists,
    details: exists ? assetHashes.get(hash) : null
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});