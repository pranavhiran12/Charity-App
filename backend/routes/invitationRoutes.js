const router = require('express').Router();
const {
    sendInvitation,
    respondToInvitation,
    guestRSVP,
    getInvitationsByEvent,
    getInvitationByCode,
    autoLinkInvitation,
    rsvpByInviteCode,
    updateInvitationWithGuest,
    getReceivedInvitations, // ✅ added
    getInvitationStats,
    createTestInvitation, // ✅ added for testing
    debugInvitations // ✅ added for debugging
    //getInvitationsByUser        // ✅ optional: all sent invites by user
} = require('../controllers/invitationController');

const authMiddleware = require('../middleware/authmiddleware'); // ✅ auth required for some routes

console.log("✅ Invitation routes loaded");

router.get('/received', authMiddleware, (req, res, next) => {
    console.log("📥 /received route hit");
    next();
}, getReceivedInvitations);


router.get('/test', (req, res) => {
    console.log("🚨 /test route hit");
    res.send("Test OK");
});


// Send invitation(s)
router.post('/send/:eventId', authMiddleware, sendInvitation);

// RSVP and response updates
router.put('/:invitationCode/respond', respondToInvitation);
router.post('/rsvp/:code', guestRSVP);
router.put('/rsvp/:inviteCode', rsvpByInviteCode);

// ✅ Test endpoint for creating test invitations
console.log("🔧 Registering /create-test route");
router.post('/create-test', authMiddleware, createTestInvitation);

// ✅ Debug endpoint for checking all invitations
router.get('/debug', authMiddleware, debugInvitations);

// Linking and guest update
router.post('/autolink', authMiddleware, autoLinkInvitation);
router.put('/update-guest', updateInvitationWithGuest);

// Fetching invitations
router.get('/event/:eventId', getInvitationsByEvent);
router.get('/stats/:eventId', getInvitationStats);
router.get('/:code', getInvitationByCode);

// ✅ Optional: Sent invitations by logged-in user
//router.get('/sent', authMiddleware, getInvitationsByUser);

module.exports = router;