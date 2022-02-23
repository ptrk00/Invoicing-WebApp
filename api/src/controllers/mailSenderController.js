const sgMail = require('@sendgrid/mail');
const fs = require("fs");
const path = require("path");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

exports.sendInvoice = async (req,res) => {

    const attachment = new Buffer(req.invoice).toString('base64');

    const message = {
        to: process.env.SEND_GRID_RECEIVER, /* TODO: replace with user.email */
        from: process.env.SEND_GRID_SENDER,
        subject: "Invoice",
        text: "You have one unpaid invoice",
        attachments : [
            {
                content: attachment,
                filename: `${req.clientFullname}_invoice.pdf`,
                type: "application/pdf",
                disposition: "attachment"
            }
        ]
    }

    try {
        await sgMail.send(message);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json(err);
    }

}

// TODO: send all invoices for one client


// TODO: send all invoices for all clients

