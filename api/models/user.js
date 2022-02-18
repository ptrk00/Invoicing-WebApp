const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    clients: [{type: Schema.Types.ObjectId, ref: 'client'}]
}, {timestamps: true});

module.exports = mongoose.model('user', User);

