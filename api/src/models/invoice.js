const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Represents invoice. Many invoice can be associated with one client.
 * @typedef {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>} Invoice
 * @property {Client} client - represents the owner of the invoice
 * @property {Number} amount - the amount of money
 * @property {Date} date - the invoice date
 */
const Invoice = new Schema({
    client: {type: Schema.Types.ObjectId, ref: 'client', required: true},
    amount: {type: Number, required: true},
    date: {type: Date, required: true}
});

module.exports = mongoose.model('invoice', Invoice);

