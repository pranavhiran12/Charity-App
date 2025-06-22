const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
} = require('../controllers/notificationController');

const authMiddleware = require('../middleware/authmiddleware');

// ✅ Protect all routes
router.use(authMiddleware);

// 📥 Get all notifications for logged-in user
router.get('/', getNotifications);

// ✅ Mark single notification as read
router.put('/:id/read', markNotificationAsRead);

// ✅ Mark all as read
router.put('/mark-all-read', markAllAsRead);

// 🗑️ Delete one notification
router.delete('/:id', deleteNotification);

// 🗑️ Delete all notifications
router.delete('/', deleteAllNotifications);

module.exports = router;