const authenticateToken = require("../auth/tokenAuth");
const {authorizeClientAccess} = require("../controllers/clientController");
const mailSenderController = require("../controllers/mailSenderController");
const invoiceGeneratorController = require("../controllers/invoiceGeneratorController");
const stripeController = require("../controllers/stripeController");
const router = require('express').Router();

router.post('/client/:clientId/invoice/:invoiceId', authenticateToken, authorizeClientAccess,
    invoiceGeneratorController.preparePDF,
    mailSenderController.sendInvoice);

module.exports = router;