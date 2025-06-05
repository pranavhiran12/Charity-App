const router = require('express').Router();
const {
    getAllCharities,
    createCharity,
} = require('../controllers/charityController');

router.get('/', getAllCharities);
router.post('/', createCharity);

module.exports = router;