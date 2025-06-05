const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authmiddleware');

// Route: GET /api/dashboard/summary
router.get('/summary', authMiddleware, getDashboardSummary);

module.exports = router;