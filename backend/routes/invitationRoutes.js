/*const router = require('express').Router();
const {
    sendInvitation,
    respondToInvitation,
    guestRSVP,
    getInvitationsByEvent,
    getInvitationByCode,
    autoLinkInvitation,
    rsvpByInviteCode
} = require('../controllers/invitationController');

router.post('/send/:eventId', sendInvitation);
router.put('/:invitationCode/respond', respondToInvitation);
router.post('/rsvp/:code', guestRSVP);
router.get('/event/:eventId', getInvitationsByEvent);
router.get('/:code', getInvitationByCode);
router.post('/autolink', autoLinkInvitation);
router.put('/rsvp/:inviteCode', rsvpByInviteCode);

module.exports = router;*/

const router = require('express').Router();
const {
    sendInvitation,
    respondToInvitation,
    guestRSVP,
    getInvitationsByEvent,
    getInvitationByCode,
    autoLinkInvitation,
    rsvpByInviteCode
} = require('../controllers/invitationController');

router.post('/send/:eventId', sendInvitation);
router.put('/:invitationCode/respond', respondToInvitation);
router.post('/rsvp/:code', guestRSVP);
router.get('/event/:eventId', getInvitationsByEvent);
router.get('/:code', getInvitationByCode);
router.post('/autolink', autoLinkInvitation);
router.put('/rsvp/:inviteCode', rsvpByInviteCode);

module.exports = router;