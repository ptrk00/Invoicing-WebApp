const Invoice = require("../models/invoice");
/* TODO: process env this api key */
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// module.exports.registerStripeInvoice = async (req,res,next) => {
//
//     const product = await stripe.products.create({name: 'super product'});
//
//     const price = await stripe.prices.create({
//         product: product.id,
//         unit_amount: req.invoiceData.amount * 100,
//         currency: 'usd'
//     });
//
//     const customer = await stripe.customers.create({
//         name: 'Johnk Kowalsky',
//         email: process.env.SEND_GRID_RECEIVER,  /* TODO: replace */
//         description: 'First test customer',
//     });
//
//     const invoiceItem = await stripe.invoiceItems.create({
//         customer: customer.id,
//         price: price.id,
//     });
//
//     const invoice = await stripe.invoices.create({
//         customer: customer.id,
//         collection_method: 'send_invoice',
//         days_until_due: 1
//     })
//
//     const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
//
//     const send = await stripe.invoices.sendInvoice(invoice.id);
//
//     req.stripeInvoiceId = invoice.id;
//
//     next();
// }
//
// module.exports.payStripeInvoice = async (req,res) => {
//     try {
//         await stripe.invoices.pay(req.params.stripeInvoiceId);
//         res.sendStatus(200);
//     } catch(err) {
//         console.log(err);
//         res.sendStatus(500);
//     }
// }

module.exports.payment = async (req,res, next) => {

    const invoiceId = req.params.invoiceId;

    try {
        const invoice = await Invoice.findById(invoiceId).exec();

        await stripe.charges.create({
            source: 'tok_visa',
            amount: invoice.amount,
            currency: "usd"
        });

        next();

    } catch(err) {
        res.sendStatus(500);
    }

}