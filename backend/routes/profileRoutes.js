const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const authenticate = require('../middleware/authmiddleware');

router.get('/', authenticate, getProfile);
router.post('/', authenticate, updateProfile);

module.exports = router;