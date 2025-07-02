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
    getInvitationStats
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

// Fetching invitations
router.get('/event/:eventId', getInvitationsByEvent);
router.get('/:code', getInvitationByCode);

// Linking and guest update
router.post('/autolink', authMiddleware, autoLinkInvitation);
router.put('/update-guest', updateInvitationWithGuest);

router.get('/stats/:eventId', getInvitationStats);

// ✅ New: Received invitations for logged-in user



// ✅ Optional: Sent invitations by logged-in user
//router.get('/sent', authMiddleware, getInvitationsByUser);

module.exports = router;