const server = require('../../app');
const supertest = require('supertest');
const request = supertest(server);
const mongoose = require('mongoose');
const User = require('../../models/user');
const CryptoJS = require("crypto-js");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URL);
    const encryptedPasswd = await CryptoJS.AES.encrypt("123", process.env.PASSWORD_SECRET).toString();
    await User.create({
        username: "user",
        password: encryptedPasswd,
        email: "test@test.test"
    });
})

afterEach(async () => {
    await User.deleteMany({});
});


describe('JWT testing', ()=>{

    // it('Logged user should have jwt',   (done) => {
    //      request.post('/users/login').send({
    //         username: "user",
    //         password: "123"
    //     }
    //     ).end((err, res) => {
    //         if(err)
    //             return done(err);
    //
    //         expect(res.body).toHaveProperty('token');
    //         expect(res.status).toEqual(200);
    //         return done();
    //     });
    // });

    // it('Logged user should have jwt',   (done) => {
    //     request.post('/users/login').send({
    //             username: "user",
    //             password: "123"
    //         }
    //     ).end((err, res) => {
    //         if(err)
    //             return done(err);
    //
    //         expect(res.body).toHaveProperty('token');
    //         expect(res.status).toEqual(200);
    //         return done();
    //     });
    // });

    it('Logged user should have jwt',   async() => {

        expect.assertions(2);
      //  try {
            const res = await request.post('/users/login').send({
                    username: "user",
                    password: "123"
                }
            );
            expect(res.body).toHaveProperty('token');
            expect(res.status).toEqual(200);
        //        // } catch(err) {
     //       console.log(err);
     //

    });


});
//
// });
//
// afterAll(async (done) => {
//     await server.close();
//     await mongoose.connection.close();
//   //  await mongoose.disconnect();
//     done();
// })

// describe('test made for testing purposes :)', ()=>{
//     it('GET / should show homepage',  (done) => {
//         request.get('/').expect(200).expect((res)=> {
//                 res.body = "Hello";
//             }
//         ).end((err,res) => {
//             if(err)
//                 return done(err);
//             return done();
//         });
//     });
// });

afterAll( async () => {
    await mongoose.connection.close(true);
});