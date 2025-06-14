const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const {
    getUserContacts,
    deleteContact,
    addContact
} = require('../controllers/contactController');

router.get('/', auth, getUserContacts);
router.post('/', auth, addContact);
router.delete('/:id', auth, deleteContact);

module.exports = router;