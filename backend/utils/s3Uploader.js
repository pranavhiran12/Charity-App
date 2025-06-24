// utils/s3Uploader.js
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

require('dotenv').config();

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET,
        acl: 'public-read', // for public URLs
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = file.originalname.split('.').pop();
            cb(null, `uploads/${Date.now()}-${file.originalname}`);
        },
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

module.exports = upload;
