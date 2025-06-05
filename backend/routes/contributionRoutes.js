const router = require('express').Router();
const {
    addContribution,
    addDirectContribution,
    getEventContributions,
    getGuestContributions,
    getContributionById,
    getTotalContributionForEvent,
    deleteContribution
} = require('../controllers/contributionController');

router.post('/', addContribution);
router.post('/direct', addDirectContribution);
router.get('/event/:eventId', getEventContributions);
router.get('/guest/:guestId', getGuestContributions);
router.get('/total/:eventId', getTotalContributionForEvent);
router.get('/:id', getContributionById);
router.delete('/:id', deleteContribution);

module.exports = router;