const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Client = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    invoices: [{type: Schema.Types.ObjectId, ref: 'invoice'}]
});

Client.virtual('fullname').get(function() {
    return this.firstname + ' ' + this.lastname;
})

module.exports = mongoose.model('client', Client);