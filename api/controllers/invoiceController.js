const Invoice = require("../models/invoice");
const User = require("../models/user");
const Client = require("../models/client");

// ensure that the invoice id in req belongs to client's invoices
exports.authorizeInvoiceAccess = async (req,res, next) => {

    const clientId = req.params.clientId;
    const invoiceId = req.params.invoiceId;

    // check if the invoice to be found is in the client's invoice list
    const doc = await Client.findOne({
        _id: clientId,
        invoices: invoiceId}).exec();

    // unauthorized
    if(!doc) {
        return res.sendStatus(401);
    }
    else {
        // authorized
        next();
    }
}

exports.addInvoice = async (req,res) => {

    const clientId = req.params.clientId;

    const invoiceBody = {...req.body, client: clientId};

    try {
        const invoice = await Invoice.create(invoiceBody);

        // returnDocument: after - returns updated document
        const client = await Client.findOneAndUpdate({_id: clientId}, {$push: {invoices: invoice._doc._id}}, {returnDocument: 'after'}).populate('invoices').exec();
        res.status(200).json(client);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}

exports.getInvoice = async (req,res) => {

    const clientId = req.params.clientId;
    const invoiceId = req.params.invoiceId;

    try {
        const invoice = await Invoice.findById(invoiceId).exec();
        res.status(200).json(invoice);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}