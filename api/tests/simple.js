const server = require('../app');
const supertest = require('supertest');
const request = supertest(server);


describe('test made for testing purposes :)', ()=>{
    it('GET / should show homepage',  (done) => {
         request.get('/').expect(200).expect((res)=> {
            res.body = "Hello";
         }
            ).end((err,res) => {
                if(err)
                    return done(err);
                return done();
            });
    });
});
