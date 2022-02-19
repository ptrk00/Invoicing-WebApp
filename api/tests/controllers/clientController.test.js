const server = require('../../app');
const supertest = require('supertest');
const request = supertest(server);
const mongoose = require('mongoose');
const User = require('../../models/user');
const CryptoJS = require("crypto-js");
const Client = require('../../models/client');

let loginRes = null;

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
})

// afterEach(async () => {
//     await User.deleteMany({});
// });


describe('client controller CRUD operations', ()=>{

    it('should add client to user',   async() => {

        expect.assertions(2);
        const res = await request.post('/client')
            .auth(loginRes._body.token, {type: 'bearer'})
            .send({
                firstname: "fname",
                lastname: "lname",
            }
        );
        expect(res.body.clients[0].firstname).toEqual('fname');
        expect(res.status).toEqual(200);

    });

    it('should get one client from user', async() => {

        const fname = "getClientFname";
        const lname = "getClientLname";

        const client = await Client.create({
            firstname: fname,
            lastname: lname,
        });

        await User.findOneAndUpdate({username: "user"}, {$push: {clients: client._doc._id}});

        expect.assertions(3);

        const res = await request.get(`/client/${client._doc._id}`)
            .auth(loginRes._body.token, {type: 'bearer'});

        expect(res.body.firstname).toEqual(fname);
        expect(res.body.lastname).toEqual(lname);
        expect(res.status).toEqual(200);


    });

    it('should update client', async() => {

        const fname = "updateClientFname";
        const lname = "updateClientLname";

        const client = await Client.create({
            firstname: fname,
            lastname: lname,
        });

        await User.findOneAndUpdate({username: "user"}, {$push: {clients: client._doc._id}});

        const updatedFname = "updatedClientFname";
        const updatedLname = "updatedClientLname";

        const res = await request.put(`/client/${client._doc._id}`)
            .auth(loginRes._body.token, {type: 'bearer'})
            .send({
                firstname: updatedFname,
                lastname: updatedLname,
            });

        expect.assertions(3);
        expect(res.body.firstname).toEqual(updatedFname);
        expect(res.body.lastname).toEqual(updatedLname);
        expect(res.status).toEqual(200);

    });

    it('should delete client from user', async() => {

        const clientToBeDel = await Client.create({
            firstname: "delClientfname",
            lastname: "delClientlname"
        });

        await User.findOneAndUpdate({username: "user"}, {$push: {clients: clientToBeDel._doc._id}});

        const res = await request.delete(`/client/${clientToBeDel._doc._id}`)
            .auth(loginRes._body.token, {type: 'bearer'});

        const dbRes = await Client.findById(clientToBeDel._doc._id).exec();

        expect.assertions(2);
        expect(res.status).toEqual(200);
        expect(dbRes).toBeNull();

    });

    it("should get all user's clients", async() => {

        const fname1 = "getAll1f";
        const lname1 = "getAll1l";
        const fname2 = "getAll2f";
        const lname2 = "getAll2l";

        const clients = [{firstname: fname1, lastname: lname1 },{firstname: fname2, lastname: lname2}];

        await Client.deleteMany({});
        const dbRes = await Client.collection.insertMany(clients);

        await User.findOneAndUpdate({username: "user"}, {$push: {clients: {$each: [dbRes.insertedIds[0],dbRes.insertedIds[1]]}}});

        const res = await request.get('/client')
            .auth(loginRes._body.token, {type: 'bearer'});

        expect.assertions(4);

        expect(res.body).toHaveLength(2);
        expect(res.body.some(client => client.firstname === fname1)).toBeTruthy();
        expect(res.body.some(client => client.lastname === lname2)).toBeTruthy();
        expect(res.status).toEqual(200);
    });


});


afterAll( async () => {
    await Client.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close(true);
});