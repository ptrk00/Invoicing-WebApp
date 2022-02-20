const User = require('../models/user');
const Client = require('../models/client');

// ensure that the client id in req belongs to user client's
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