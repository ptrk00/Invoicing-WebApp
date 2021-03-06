const User = require('../models/user');
const Client = require('../models/client');


/**
 * Ensure that the client id in req belongs to user client's.
 *
 * @function authorizeClientAccess
 *
 * @param {Object} req - Express request object
 * @param {Number} req.userId.id - id of user that made the request
 * @param {Number} req.params.clientId - id of client to be accessed
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.authorizeClientAccess = async (req,res, next) => {

    const userId = req.userId.id;
    const clientId = req.params.clientId;

    // check if the client to be found is in the user client's list
    const doc = await User.findOne({
        _id: userId,
        clients: clientId}).exec();

    // unauthorized - user can 'get' only his own clients
    if(!doc) {
        return res.sendStatus(401);
    }
    else {
        // authorized
        next();
    }
}


/**
 * Add new client to user.
 *
 * @function addClient
 *
 * @param {Object} req - Express request object
 * @param {Number} req.userId.id - id of user that made the request
 * @param {Client} req.body - Client object to be added
 * @param {Object} res - Express response object
 */
exports.addClient = async (req,res) => {

    const userId = req.userId.id;
    try {
        const client = await Client.create(req.body);

        // returnDocument: after - returns updated document
        const user = await User.findOneAndUpdate({_id: userId}, {$push: {clients: client._doc._id}}, {returnDocument: 'after'}).populate('clients').exec();
        res.status(200).json(user);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}


/**
 * Get single client.
 *
 * @function getClient
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.clientId - id of client to be accessed
 * @param {Object} res - Express response object
 */
exports.getClient = async(req,res) => {

    const clientId = req.params.clientId;
    try {
        const client = await Client.findById(clientId).exec();
        res.status(200).json(client._doc);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}


/**
 * Get all clients of single user.
 *
 * @function getAllClients
 *
 * @param {Object} req - Express request object
 * @param {Number} req.userId.id - id of user that made the request
 * @param {Object} res - Express response object
 */
exports.getAllClients = async(req,res) => {

    const userId = req.userId.id;

    try {
        const userDoc = await User.findById(userId).populate('clients').exec();
        const clients = [...userDoc._doc.clients];
        res.status(200).json(clients);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }

}


/**
 * Delete single client.
 *
 * @function deleteClient
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.clientId - id of client to be accessed
 * @param {Object} res - Express response object
 */
exports.deleteClient = async(req,res) => {

    const clientId = req.params.clientId;
    try {
        await Client.findByIdAndDelete(clientId).exec();
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }

}


/**
 * Update single client.
 *
 * @function updateClient
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.clientId - id of client to be accessed
 * @param {Client} req.body - new Client object that should replace the old one
 * @param {Object} res - Express response object
 */
exports.updateClient = async (req,res) => {

    const clientId = req.params.clientId;
    try {
        const updated = await Client.findByIdAndUpdate(clientId, {$set: req.body}, {returnDocument: 'after'}).exec();
        res.status(200).json(updated);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}