const router = require('express').Router();
const userController = require('../controllers/clientController');
const authenticateToken = require('../auth/tokenAuth');

router.post('/', authenticateToken, userController.addClient);
router.get('/:id', authenticateToken, userController.authorizeClientAccess, userController.getClient);
router.get('/', authenticateToken, userController.getAllClients);
router.delete('/:id', authenticateToken,  userController.authorizeClientAccess, userController.deleteClient);
router.put('/:id', authenticateToken,  userController.authorizeClientAccess, userController.updateClient);

module.exports = router;