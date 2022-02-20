const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Represents client. Many clients can be associated with one user.
 * @typedef {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>} Client
 * @property {String} firstname - client's firstname
 * @property {String} lastname - client's lastname
 * @property {Array<Invoice>} invoices - invoices associated with client
 * @property {String} fullname - client's firstname and lastname concatenated with space in between
 */
const Client = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    invoices: [{type: Schema.Types.ObjectId, ref: 'invoice'}]
});

Client.virtual('fullname').get(function() {
    return this.firstname + ' ' + this.lastname;
})

module.exports = mongoose.model('client', Client);