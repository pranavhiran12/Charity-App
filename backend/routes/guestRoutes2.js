const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authmiddleware');
const {
    getGuests,
    addGuest,
    deleteGuest
} = require('../controllers/guestController2');

router.get('/', authenticateUser, getGuests);
router.post('/', authenticateUser, addGuest);
router.delete('/:id', authenticateUser, deleteGuest);

module.exports = router;