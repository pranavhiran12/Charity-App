const express = require('express');
const router = express.Router();
const guestController = require("../controllers/guestController");
console.log("👋 Guest routes loaded");


/*router.post('/debug', (req, res) => {
    console.log('✅ /api/guests/debug hit');
    res.send('Debug route works');
});


router.use((req, res, next) => {
    console.log("🚨 Incoming request on /api/guests route");
    next();
});

// Import handlers inline to avoid circular reference
router.post('/test', (req, res) => {
    console.log("✅ TEST route hit");
    res.send('Guest test route working');
});*/

router.post('/:eventId/rsvp', require('../controllers/guestController').rsvpGuest);
router.post('/event/:eventId', require('../controllers/guestController').addGuestToEvent);
router.get('/by-email', require('../controllers/guestController').getGuestByEmail);
router.get('/find', require('../controllers/guestController').findGuest);
router.get('/event/:eventId', require('../controllers/guestController').getGuestsByEvent);
router.get('/', require('../controllers/guestController').getAllGuests);
router.put('/:id', require('../controllers/guestController').updateGuest);
router.delete('/:guestId', require('../controllers/guestController').deleteGuest);
router.post('/', require('../controllers/guestController').createGuest); // 🔥 this was breaking
router.get("/:eventId/rsvp-count", guestController.getRSVPStatusCount);



module.exports = router;