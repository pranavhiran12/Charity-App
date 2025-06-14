// controllers/contactController.js
const Contact = require('../models/Contact');



//const Contact = require('../models/Contact');

// POST /api/contacts
exports.addContact = async(req, res) => {
    try {
        const { name, email, mobile } = req.body;
        if (!name || !email || !mobile) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newContact = new Contact({
            name,
            email,
            mobile,
            user: req.user._id,
        });

        await newContact.save();
        res.status(201).json(newContact);
    } catch (err) {
        console.error('Add contact error:', err);
        res.status(500).json({ message: 'Failed to add contact' });
    }
};


// GET /api/contacts?q=searchTerm
exports.getUserContacts = async(req, res) => {
    try {
        const search = req.query.q || '';
        const regex = new RegExp(search, 'i'); // case-insensitive

        const contacts = await Contact.find({
            user: req.user._id,
            $or: [
                { name: regex },
                { email: regex },
                { mobile: regex }
            ]
        }).sort({ createdAt: -1 });

        res.json(contacts);
    } catch (err) {
        console.error('Get contacts error:', err);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
};

// DELETE /api/contacts/:id
exports.deleteContact = async(req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        res.json({ message: 'Contact deleted' });
    } catch (err) {
        console.error('Delete contact error:', err);
        res.status(500).json({ message: 'Failed to delete contact' });
    }
};