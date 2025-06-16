const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
    getAllCharities,
    getCharityById,
    createCharity,
    updateCharity,
    deleteCharity
} = require('../controllers/charityController');

// Setup Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
router.get('/', getAllCharities);
router.get('/:id', getCharityById);
router.post('/', upload.single('logo'), createCharity);
router.put('/:id', upload.single('logo'), updateCharity);
router.delete('/:id', deleteCharity);

module.exports = router;