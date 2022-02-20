const server = require('../../app');
const supertest = require('supertest');
const request = supertest(server);
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const CryptoJS = require("crypto-js");
const Client = require('../../src/models/client');
const Invoice = require('../../src/models/invoice');

let loginRes = null;
let clientRes = null;

beforeAll(async () => {

    await mongoose.connect(process.env.MONGO_TEST_URL);
    await Client.deleteMany({});
    await User.deleteMany({});
    const encryptedPasswd = await CryptoJS.AES.encrypt("123", process.env.PASSWORD_SECRET).toString();

    await User.create({
        username: "user",
        password: encryptedPasswd,
        email: "test@test.test"
    });

    loginRes = await request.post('/auth/login').send({
        username: "user",
        password: "123"
    });

    clientRes = await request.post('/client')
        .auth(loginRes._body.token, {type: 'bearer'})
        .send({
            firstname: "clientf",
            lastname: "clientl",
        });

});

describe('invoice controller CRUD operations', ()=>{

    it('should add single invoice', async() => {


        const res = await request.post(`/client/${clientRes._body.clients[0]._id}/invoice`)
            .auth(loginRes._body.token, {type: 'bearer'})
            .send({
                    amount: 300,
                    date: Date.now().toString()
                }
            );

        expect.assertions(3);

        expect(res.body.invoices).toHaveLength(1);
        expect(res.body.invoices[0].amount).toEqual(300);
        expect(res.status).toEqual(200);

    });

    it('should get single invoice', async() => {

        const clientId = clientRes._body.clients[0]._id;

        const invoice = await Invoice.create({
            client: clientId,
            amount: 500,
            date: Date.now().toString()
        });

        const invoiceId = invoice._doc._id;

        await Client.findOneAndUpdate({firstname: "clientf"},{$push: {invoices: invoiceId}})



        const res = await request.get(`/client/${clientId}/invoice/${invoiceId}`)
            .auth(loginRes._body.token, {type: 'bearer'});

        expect.assertions(2);

        expect(res.body.amount).toEqual(500);
        expect(res.status).toEqual(200);

    });

    it('should update single invoice', async() => {

        const clientId = clientRes._body.clients[0]._id;

        const invoice = await Invoice.create({
            client: clientId,
            amount: 111,
            date: Date.now().toString()
        });

        const invoiceId = invoice._doc._id;

        await Client.findOneAndUpdate({firstname: "clientf"},{$push: {invoices: invoiceId}})



        const res = await request.put(`/client/${clientId}/invoice/${invoiceId}`)
            .auth(loginRes._body.token, {type: 'bearer'})
            .send({amount: 777});

        expect.assertions(2);

        expect(res.body.amount).toEqual(777);
        expect(res.status).toEqual(200);

    });


    it('should delete single invoice', async() => {

        const clientId = clientRes._body.clients[0]._id;

        const invoice = await Invoice.create({
            client: clientId,
            amount: 999,
            date: Date.now().toString()
        });

        const invoiceId = invoice._doc._id;

        await Client.findOneAndUpdate({firstname: "clientf"},{$push: {invoices: invoiceId}})



        const res = await request.delete(`/client/${clientId}/invoice/${invoiceId}`)
            .auth(loginRes._body.token, {type: 'bearer'});

        expect.assertions(2);

        const found = await Invoice.findOne({amount: 999}).exec();

        expect(found).toBeNull();
        expect(res.status).toEqual(200);

    });


    // TODO: fix
    it('should get all invoices from one client', async() => {

        await Invoice.deleteMany({});

        const clientId = clientRes._body.clients[0]._id;

        const invoices =  [{amount: 122, date: Date.now().toString()}, {amount: 123, date: Date.now().toString()}];

        const dbRes = await Invoice.collection.insertMany(invoices);

        await User.findOneAndUpdate({username: "user"}, {$push: {clients: {$each: [dbRes.insertedIds[0],dbRes.insertedIds[1]]}}});

        const res = await request.get(`/client/${clientId}/invoice`)
            .auth(loginRes._body.token, {type: 'bearer'});

        console.log(res);

        expect.assertions(4);

        expect(res.body).toHaveLength(2);
        expect(res.body.some(invoice => invoice.amount === 122)).toBeTruthy();
        expect(res.body.some(invoice => invoice.amount === 123)).toBeTruthy();
        expect(res.status).toEqual(200);

    });



});

afterAll( async () => {
    await mongoose.connection.close(true);
});