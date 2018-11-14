import request from 'supertest';
const app = require("../server/app");
import Users from '../server/db/users';
import React from 'react';
import expect from 'expect';

/*eslint-disable no-console */
const errorHandler = function(err, req, res, next){
    console.log(err.stack);
    res.send(500);
};
app.use(errorHandler);


beforeEach(() => {Users.resetAllUsers();});

describe("Test failed login", () =>{
  it('Test failed login', async () => {
    const response = await request(app)
        .post('/api/login')
        .send({userId: 'foo', password: '123'});

    expect(response.statusCode).toBe(401);
  });
});


describe("Test sign up", () =>{
  it('Test sign up', async () => {

    const response = await request(app)
        .post('/api/signup')
        .send({userId: 'foo', password: '123'});

    expect(response.statusCode).toBe(204);
  });

});


describe("Test fail sign up twice", () =>{
  it('Test fail sign up twice', async () => {

    const payload = {userId: 'foo', password: '123'};

    let response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(204);

    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(400);
  });

});


describe("Test logged in when signing up", () =>{
  it('Test logged in when signing up', async () => {

    const payload = {userId: 'foo', password: '123'};

    let response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(payload.userId);
  });
});


describe("Test sign up, and then login", () =>{
  it('Test sign up, and then login', async () => {

    const payload = {userId: 'foo', password: '123'};

    let response = await request(app)
        .get('/api/user');
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(204);


    response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    response = await request(app)
        .get('/api/user')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(payload.userId);
  });
});


describe("Test login with wrong password", () =>{
  it('Test login with wrong password', async () => {

    const userId = "foo";
    const password = "123";
    const payload = {userId, password};

    let response = await request(app)
        .post('/api/signup')
        .send(payload);
    expect(response.statusCode).toBe(204);

    response = await request(app)
        .post('/api/login')
        .send({userId, password: "a wrong password"});
    expect(response.statusCode).toBe(401);

    response = await request(app)
        .post('/api/login')
        .send(payload);
    expect(response.statusCode).toBe(204);
  });
});



// describe("Test logout", () =>{
//   it('Test logout', async () => {

//     const payload = {userId: "foo", password: "123"};

//     let response = await request(app)
//         .post('/api/signup')
//         .send(payload);
//     expect(response.statusCode).toBe(204);
//     const cookie = response.headers['set-cookie'];

//     response = await request(app)
//         .get('/api/user')
//         .set('cookie', cookie);
//     expect(response.statusCode).toBe(200);

//     await  request(app)
//         .post('/api/logout')
//         .set('cookie', cookie)
//         .send();

//     response = await request(app)
//         .get('/api/user')
//         .set('cookie', cookie);
//     expect(response.statusCode).toBe(401);
//   });
// });



describe("Test get token", () =>{
  it('Test get token', async () => {

    let response = await request(app)
        .post('/api/signup')
        .send({userId: "foo", password: "123"});
    expect(response.statusCode).toBe(204);
    const cookie = response.headers['set-cookie'];

    response = await request(app)
        .post('/api/wstoken');
    expect(response.statusCode).toBe(401);


    response = await request(app)
        .post('/api/wstoken')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(201);
    expect(response.body.wstoken).toBeDefined();
    const first = response.body.wstoken;

    response = await request(app)
        .post('/api/wstoken')
        .set('cookie', cookie);
    expect(response.statusCode).toBe(201);
    expect(response.body.wstoken).toBeDefined();
    const second = response.body.wstoken;

    expect(first).not.toBe(second);
  });
});






