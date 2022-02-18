const User = require('../models/user');
const Client = require('../models/client');

exports.addClient = async (req,res) => {

    const userId = req.userId.id;
    try {
        const client = await Client.create(req.body);
        const user = await User.findOneAndUpdate({_id: userId}, {$push: {clients: client._doc._id}}).populate('clients').exec();
        res.status(200).json(user);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}