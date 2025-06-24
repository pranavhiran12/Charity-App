/*const router = require('express').Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or configure storage options

const {
    getAllUsers,
    getAllEvents,
    getAllContributions,
    getAllCharities,
    createCharity,
    updateCharity,
    deleteUser,
    deleteEvent,
    deleteCharity
} = require('../controllers/adminController');

router.get('/users', getAllUsers);
router.get('/events', getAllEvents);
router.get('/contributions', getAllContributions);
router.get('/charities', getAllCharities);
router.post('/charity', upload.single('image'), createCharity); // <-- ✅ handles image
router.put('/charity/:id', upload.single('image'), updateCharity); // <-- ✅ handles image
router.delete('/user/:id', deleteUser);
router.delete('/event/:id', deleteEvent);
router.delete('/charity/:id', deleteCharity);

module.exports = router;*/

const router = require('express').Router();
const User = require('../models/User');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // You can configure this with diskStorage for file names

const {
    getAllUsers,
    getAllEvents,
    getAllContributions,
    getAllCharities,
    createCharity,
    updateCharity,
    deleteUser,
    deleteEvent,
    deleteCharity
} = require('../controllers/adminController');

// ✅ Ensure these are required
const authMiddleware = require('../middleware/authmiddleware'); // Checks JWT
const adminOnly = require('../middleware/adminOnly'); // Checks req.user.role === 'admin'

// Routes
router.get('/users', authMiddleware, adminOnly, getAllUsers);
router.get('/events', authMiddleware, adminOnly, getAllEvents);
router.get('/contributions', authMiddleware, adminOnly, getAllContributions);
router.get('/charities', authMiddleware, adminOnly, getAllCharities);

router.post('/charity', authMiddleware, adminOnly, upload.single('image'), createCharity);
router.put('/charity/:id', authMiddleware, adminOnly, upload.single('image'), updateCharity);

router.delete('/user/:id', authMiddleware, adminOnly, deleteUser);
router.delete('/event/:id', authMiddleware, adminOnly, deleteEvent);
router.delete('/charity/:id', authMiddleware, adminOnly, deleteCharity);

// ✅ Promote user to admin
router.put('/make-admin/:id', authMiddleware, adminOnly, async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { role: 'admin' });
        res.json({ message: 'User promoted to admin' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to promote' });
    }
});

module.exports = router;