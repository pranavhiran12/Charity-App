const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/paymentController');


const { savePayment } = require('../controllers/paymentController');

router.post('/create-order', createOrder);



router.post('/save', savePayment);

module.exports = router;