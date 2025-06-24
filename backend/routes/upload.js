// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../utils/s3Uploader');

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.status(200).json({ url: req.file.location }); // This is the public S3 URL
});

module.exports = router;
