const router = require('express').Router();
const invoiceController = require('../controllers/invoiceController');
const authenticateToken = require('../auth/tokenAuth');
const {authorizeClientAccess} = require("../controllers/clientController");
const {authorizeInvoiceAccess} = require("../controllers/invoiceController");

router.get('/all/invoice',authenticateToken, invoiceController.getAllInvoicesFromAllClients);
router.post('/:clientId/invoice', authenticateToken, authorizeClientAccess,invoiceController.addInvoice);
router.get('/:clientId/invoice/:invoiceId', authenticateToken, authorizeClientAccess, authorizeInvoiceAccess, invoiceController.getInvoice);
router.get('/:clientId/invoice', authenticateToken, authorizeClientAccess, invoiceController.getAllInvoicesFromOneClient);
router.put('/:clientId/invoice/:invoiceId', authenticateToken, authorizeClientAccess, authorizeInvoiceAccess, invoiceController.updateInvoice);
router.delete('/:clientId/invoice/:invoiceId', authenticateToken, authorizeClientAccess, authorizeInvoiceAccess, invoiceController.deleteInvoice);


module.exports = router;