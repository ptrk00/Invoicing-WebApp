const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Represents User. User can be associated with many clients.
 * @typedef {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>} User
 * @property {String} username - username
 * @property {String} password - password
 * @property {String} email - email that will be used to send generated invoices
 * @property {Array<Client>} clients - clients that are associated with user
 */
const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    clients: [{type: Schema.Types.ObjectId, ref: 'client'}]
}, {timestamps: true});

module.exports = mongoose.model('user', User);

