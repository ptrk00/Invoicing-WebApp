const authenticateToken = require("../auth/tokenAuth");
const {authorizeClientAccess} = require("../controllers/clientController");
const invoiceGeneratorController = require("../controllers/invoiceGeneratorController");
const stripeController = require('../controllers/stripeController');
const router = require('express').Router();

router.post('/client/:clientId/invoice/:invoiceId', authenticateToken,
    authorizeClientAccess,
    invoiceGeneratorController.preparePDF,
    invoiceGeneratorController.generateInvoice
    );

module.exports = router;