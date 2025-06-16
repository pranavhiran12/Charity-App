const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (!['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    }
});

module.exports = upload;