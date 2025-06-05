const Charity = require('../models/Charity');

// @desc Get all charities
exports.getAllCharities = async(req, res) => {
    try {
        const charities = await Charity.find();
        res.json(charities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc Create a new charity
exports.createCharity = async(req, res) => {
    try {
        const charity = new Charity(req.body);
        await charity.save();
        res.status(201).json(charity);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};