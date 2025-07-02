const router = require('express').Router();
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');

const verifyToken = require('../middleware/authmiddleware');

// Routes
router.post('/', verifyToken, createEvent);
router.get('/', verifyToken, getAllEvents);
router.get('/:id', verifyToken, getEventById);
router.put('/:id', verifyToken, updateEvent);
router.delete('/:id', verifyToken, deleteEvent);

module.exports = router;