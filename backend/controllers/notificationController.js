const Notification = require('../models/Notification');

exports.getNotifications = async(req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};

exports.markNotificationAsRead = async(req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: 'Failed to mark as read' });
    }
};

exports.markAllAsRead = async(req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: 'Failed to mark all as read' });
    }
};

exports.deleteNotification = async(req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete notification' });
    }
};

exports.deleteAllNotifications = async(req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user._id });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete all notifications' });
    }
};