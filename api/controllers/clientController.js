const User = require('../models/user');
const Client = require('../models/client');

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

    const userId = req.userId.id;
    const clientId = req.params.id;

    // check if the client to be found is in the user client's list
    const doc = await User.findOne({
        _id: userId,
        clients: clientId}).exec();

    // unauthorized - user can 'get' only his own clients
    if(!doc) {
        res.sendStatus(401);
    }

    // authorized - find client and send json
    else {
        const client = await Client.findById(clientId).exec();
        res.status(200).json(client._doc);
    }

}

exports.getAllClients = async(req,res) => {

    const userId = req.userId.id;

    // check if the client to be found is in the user client's list
    const userDoc = await User.findById(userId).populate('clients').exec();

    // unauthorized - user can 'get' only his own clients
    if(!userDoc) {
        res.sendStatus(401);
    }

    // authorized
    else {
        const clients = [...userDoc._doc.clients];
        res.status(200).json(clients);
    }

}

// TODO: fix
exports.deleteClient = async(req,res) => {

    const clientId = req.params.id;

    try {
        await Client.findByIdAndDelete(clientId);
        res.status(200);
    } catch(err) {
        res.status(500).json(err);
    }


}