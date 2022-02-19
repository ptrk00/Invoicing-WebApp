const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Invoice = new Schema({
    client: {type: Schema.Types.ObjectId, ref: 'client', required: true},
    amount: {type: Number, required: true},
    date: {type: Date, required: true}
});

module.exports = mongoose.model('invoice', Invoice);

