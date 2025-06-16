const Charity = require('../models/Charity');
const path = require('path');
const fs = require('fs');

// GET /api/charities?search=&page=&limit=
exports.getAllCharities = async(req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query;

    try {
        const query = search ? { name: { $regex: search, $options: 'i' } } : {};

        const total = await Charity.countDocuments(query);
        const charities = await Charity.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            charities,
        });
    } catch (err) {
        console.error('Error fetching charities:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/charities/:id
exports.getCharityById = async(req, res) => {
    try {
        const charity = await Charity.findById(req.params.id);
        if (!charity) return res.status(404).json({ message: 'Charity not found' });
        res.json(charity);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/charities
exports.createCharity = async(req, res) => {
    try {
        const { name, description, website } = req.body;
        const logo = req.file ? `/uploads/${req.file.filename}` : null;

        const newCharity = new Charity({
            name,
            description,
            website,
            logo,
        });

        await newCharity.save();
        res.status(201).json(newCharity);
    } catch (err) {
        console.error('Error creating charity:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT /api/charities/:id
exports.updateCharity = async(req, res) => {
    try {
        const charity = await Charity.findById(req.params.id);
        if (!charity) return res.status(404).json({ message: 'Charity not found' });

        charity.name = req.body.name || charity.name;
        charity.description = req.body.description || charity.description;
        charity.website = req.body.website || charity.website;

        if (req.file) {
            // Delete old logo if it exists
            if (charity.logo) {
                const oldPath = path.join(__dirname, '../public', charity.logo);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            charity.logo = `/uploads/${req.file.filename}`;
        }

        await charity.save();
        res.json(charity);
    } catch (err) {
        console.error('Error updating charity:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /api/charities/:id
exports.deleteCharity = async(req, res) => {
    try {
        const charity = await Charity.findById(req.params.id);
        if (!charity) return res.status(404).json({ message: 'Charity not found' });

        if (charity.logo) {
            const logoPath = path.join(__dirname, '../public', charity.logo);
            if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
        }

        await charity.deleteOne();
        res.json({ message: 'Charity deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};