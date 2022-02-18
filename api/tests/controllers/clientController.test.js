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


describe('client controller testing', ()=>{

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


});


afterAll( async () => {
    await Client.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close(true);
});