const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authmiddleware');
const {
    getGuests,
    addGuest,
    deleteGuest,
    createGuest // ✅ Import the public guest creation controller
} = require('../controllers/guestController2');

// Authenticated routes
router.get('/', authenticateUser, getGuests);
router.post('/', authenticateUser, addGuest);
router.delete('/:id', authenticateUser, deleteGuest);

// Public guest creation route (no auth required)
router.post('/public', createGuest); // ✅ For public invite forms

module.exports = router;