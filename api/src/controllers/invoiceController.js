const Invoice = require("../models/invoice");
const User = require("../models/user");
const Client = require("../models/client");

/**
 * Ensure that the invoice specified by id in req belongs to client's invoices.
 *
 * @function authorizeInvoiceAccess
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.clientId - id of client that is supposed to be owner of the invoice
 * @param {Number} req.params.invoiceId - id of invoice to be accessed
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
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


/**
 * Add new invoice to client.
 *
 * @function addInvoice
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.clientId - id of client to be accessed
 * @param {Invoice} req.body - invoice object to be added
 * @param {Object} res - Express response object
 */
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

/**
 * Get single invoice.
 *
 * @function getInvoice
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.invoiceId - id of invoice to be accessed
 * @param {Object} res - Express response object
 */
exports.getInvoice = async (req,res) => {

    const invoiceId = req.params.invoiceId;

    try {
        const invoice = await Invoice.findById(invoiceId).exec();
        res.status(200).json(invoice);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
}


/**
 * Get all invoices for single client.
 *
 * @function getAllInvoicesFromOneClient
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.clientId - id of client to be accessed
 * @param {Object} res - Express response object
 */
exports.getAllInvoicesFromOneClient = async (req,res) => {

    const clientId = req.params.clientId;

    try {
        const client = await Client.findById(clientId).populate('invoices').exec();
        const invoices = [...client._doc.invoices];
        res.status(200).json(invoices);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }

}


/**
 * Update single invoice.
 *
 * @function updateInvoice
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.invoiceId - id of invoice to be accessed
 * @param {Invoice} req.body - new Invoice object that should replace the old one
 * @param {Object} res - Express response object
 */
exports.updateInvoice = async (req,res) => {

    const invoiceId = req.params.invoiceId;

    try {
        const invoice = await Invoice.findByIdAndUpdate(invoiceId, {$set: req.body}, {returnDocument: 'after'}).exec();
        res.status(200).json(invoice);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }

}


/**
 * Delete single invoice.
 *
 * @function deleteInvoice
 *
 * @param {Object} req - Express request object
 * @param {Number} req.params.invoiceId - id of invoice to be accessed
 * @param {Object} res - Express response object
 */
exports.deleteInvoice = async (req,res) => {

    const invoiceId = req.params.invoiceId;

    try {
        await Invoice.findByIdAndDelete(invoiceId).exec();
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }

}

// TODO: fix
exports.getAllInvoicesFromAllClients = async (req,res) => {

    const userId = req.userId.id;

    try {
        const user = await User.findById(userId).populate('clients').exec();
        const invoices = Invoice.find({client: {$in: user._doc.clients.map(c => c._doc.invoices._id) }}).exec();
        res.status(200).json(invoices._doc);
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
    }

}