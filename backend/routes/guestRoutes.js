const router = require('express').Router();
const {
    rsvpGuest,
    addGuestToEvent,
    getGuestByEmail,
    findGuest,
    getGuestsByEvent,
    getAllGuests,
    deleteGuest,
    updateGuest
} = require('../controllers/guestController');

// RSVP
router.post('/:eventId/rsvp', rsvpGuest);

// Add guest to event
router.post('/event/:eventId', addGuestToEvent);

// Get guest by email
router.get('/by-email', getGuestByEmail);

// Find guest (lightweight)
router.get('/find', findGuest);

// Get all guests for an event
router.get('/event/:eventId', getGuestsByEvent);

// Get all guests
router.get('/', getAllGuests);

// Update guest
router.put('/:id', updateGuest);

// Delete guest
router.delete('/:guestId', deleteGuest);

module.exports = router;