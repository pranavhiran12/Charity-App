const router = require('express').Router();
const Charity = require('../models/Charity');

router.get('/', async(req, res) => {
    const charities = await Charity.find();
    res.json(charities);
});

router.post('/', async(req, res) => {
    const charity = new Charity(req.body);
    await charity.save();
    res.status(201).json(charity);
});

module.exports = router;