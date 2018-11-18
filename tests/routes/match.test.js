import request from 'supertest';

const app = require("../../server/app");
import Matches from '../../server/db/matches';
import React from 'react';
import expect from 'expect';
import Users from "../../server/db/users";

/*eslint-disable no-console */
const errorHandler = function (err, req, res, next) {
  console.log(err.stack);
  res.send(500);
};
app.use(errorHandler);

beforeEach(() => {
  Matches.resetMatches();
  Users.resetAllUsers();

});

describe("Test get & create matches", () => {
  let cookie;

  it('Test create match and then verify' +
    ' that get all matches return the match that' +
    'was created  ', async () => {

    let response = await request(app)
      .post('/api/signup')
      .send({userId: "foo", password: "123"});
    expect(response.statusCode).toBe(204);
    cookie = response.headers['set-cookie'];

    response = await request(app)
      .post('/api/saveMatch')
      .set('cookie', cookie)
      .send({
        userId: "foo", score: 30
      });
    expect(response.statusCode).toBe(200);

    response = await request(app)
      .get('/api/getMatches')
      .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
  }).timeout(10000);

  it('Test initialisation of an online match', async () => {

    //sign up as foo
    let response = await request(app)
      .post('/api/signup')
      .send({userId: "foobar", password: "123"});
    expect(response.statusCode).toBe(204);
    cookie = response.headers['set-cookie'];

    //post to matches to initiate match,
    //since the player queue is empty
    //the expected response status code should be 200
    response = await request(app)
      .post('/api/matches')
      .set('cookie', cookie);
    expect(response.statusCode).toBe(200);

  }).timeout(10000);

});






