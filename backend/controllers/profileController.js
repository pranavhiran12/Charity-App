const UserProfile = require('../models/UserProfile');

const getProfile = async(req, res) => {
    const profile = await UserProfile.findOne({ userId: req.user._id });
    res.json(profile || {});
};

const updateProfile = async(req, res) => {
    const updated = await UserProfile.findOneAndUpdate({ userId: req.user._id }, {...req.body, userId: req.user._id }, { new: true, upsert: true });
    res.json(updated);
};

module.exports = { getProfile, updateProfile };