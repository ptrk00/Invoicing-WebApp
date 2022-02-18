const router = require('express').Router();
const userController = require('../controllers/clientController');
const authenticateToken = require('../auth/tokenAuth');

router.post('/', authenticateToken, userController.addClient);
router.get('/:id', authenticateToken, userController.getClient);
router.get('/', authenticateToken, userController.getAllClients);
router.delete('/:id', authenticateToken, userController.deleteClient);

module.exports = router;