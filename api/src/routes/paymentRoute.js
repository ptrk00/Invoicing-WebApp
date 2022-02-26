const authenticateToken = require("../auth/tokenAuth");
const stripeController = require('../controllers/stripeController');
const router = require('express').Router();

router.post('/:invoiceId', authenticateToken,
    stripeController.payment
);

module.exports = router;