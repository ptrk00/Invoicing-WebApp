const router = require('express').Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../auth/tokenAuth');

router.post('/addClient', authenticateToken, userController.addClient);

module.exports = router;