const express = require('express');
const router = express.Router();
const { getCurrentUser } = require('../controllers/userController');
const authenticateUser = require('../middleware/authmiddleware');

router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;