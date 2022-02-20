const router = require('express').Router();
const userController = require('../controllers/clientController');
const authenticateToken = require('../auth/tokenAuth');

router.post('/', authenticateToken, userController.addClient);
router.get('/:clientId', authenticateToken, userController.authorizeClientAccess, userController.getClient);
router.get('/', authenticateToken, userController.getAllClients);
router.delete('/:clientId', authenticateToken,  userController.authorizeClientAccess, userController.deleteClient);
router.put('/:clientId', authenticateToken,  userController.authorizeClientAccess, userController.updateClient);

module.exports = router;