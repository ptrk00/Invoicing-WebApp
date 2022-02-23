const {jsPDF} = require("jspdf");
const Client = require( "../models/client");
const Invoice = require("../models/invoice");

exports.generateInvoice = async (req,res) => {

        const pdf = req.invoice;
        res.status(200).attachment(`${req.clientFullname}_invoice.pdf`).send(pdf);

}

// TODO: generate all invoices for one client


// TODO: generate all invoices for all clients

exports.preparePDF = async (req,res, next) => {

    const clientId = req.params.clientId;
    const invoiceId = req.params.invoiceId;


    const client = await Client.findById(clientId).exec();
    const invoice = await Invoice.findById(invoiceId).exec();

    // TODO: generate pdf from nice looking html doc
    const doc = new jsPDF();
    const msg = `Hello ${client.fullname}!\nYou have to pay ${invoice.amount}!`;
    doc.text(msg,10,10);

    req.invoice = doc.output();
    req.clientFullname = client.fullname;
    next();
}