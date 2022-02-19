const router = require('express').Router();
const invoiceController = require('../controllers/invoiceController');
const authenticateToken = require('../auth/tokenAuth');
const {authorizeClientAccess} = require("../controllers/clientController");
const {authorizeInvoiceAccess} = require("../controllers/invoiceController");

router.post('/:clientId/invoice', authenticateToken, authorizeClientAccess,invoiceController.addInvoice);
router.get('/:clientId/invoice/:invoiceId', authenticateToken, authorizeClientAccess, authorizeInvoiceAccess, invoiceController.getInvoice);
// router.get('/', authenticateToken, invoiceController.getAllClients);
// router.delete('/:id', authenticateToken,  invoiceController.authorizeClientAccess, invoiceController.deleteClient);
// router.put('/:id', authenticateToken,  invoiceController.authorizeClientAccess, invoiceController.updateClient);

module.exports = router;