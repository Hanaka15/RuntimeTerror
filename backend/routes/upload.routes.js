const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { ensureAuth } = require('../middleware/auth.middleware');
const path = require('path');
const fs = require('fs');

// Get list of files uploaded by the current user
router.get('/', ensureAuth, async (req, res) => {
  try {
    // Assuming user info is stored in req.user after authentication
    const userId = req.user._id || req.user.id;
    
    // Get files from the user's directory (if you're organizing by user)
    // Or filter files from the database if you're storing file metadata there
    
    // For this example, we'll just return a list of all files in the uploads directory
    const uploadDir = path.join(__dirname, '../uploads');
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading files directory', error: err.message });
      }
      
      // Return list of files
      return res.json({ files });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload a single file
router.post('/single', ensureAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return file info
    return res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Upload multiple files
router.post('/multiple', ensureAuth, upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    // Return files info
    return res.status(201).json({
      message: 'Files uploaded successfully',
      count: req.files.length,
      files: req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }))
    });
  } catch (error) {
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Delete a file
router.delete('/:filename', ensureAuth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    return res.json({ message: 'File deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

// Error handler for multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred during file upload
    return res.status(400).json({ message: 'File upload error', error: err.message });
  } else if (err) {
    // Some other error occurred
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
  next();
});

module.exports = router;