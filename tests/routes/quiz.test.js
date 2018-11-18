import request from 'supertest';

const app = require("../../server/app");
import Quizzes from '../../server/db/quizzes';
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
  Quizzes.resetQuizzes();
  Users.resetAllUsers();

});


describe("Test get, create & update quizzes", () => {
  let cookie;

  it('Test create quiz and then update it ', async () => {

    let response = await request(app)
      .post('/api/signup')
      .send({userId: "foo", password: "123"});
    expect(response.statusCode).toBe(204);
    cookie = response.headers['set-cookie'];

    response = await request(app)
      .post('/api/saveQuiz')
      .set('cookie', cookie)
      .send({
        userId: "foo", question: 'question',
        answers: ["a", "b", "c", "d"], correctAnswer: 1,
        category: "Javascript"
      });
    expect(response.statusCode).toBe(200);

    response = await request(app)
      .put('/api/updateQuiz')
      .set('cookie', cookie)
      .send({
        userId: "foo", id: "question", question: 'question',
        answers: ["a", "b", "c", "d"], correctAnswer: 1,
        category: "Javascript"
      });
    expect(response.statusCode).toBe(204);

  }).timeout(10000);

  it('Test get quizzes ', async () => {

    let response = await request(app)
      .post('/api/signup')
      .send({userId: "bar", password: "123"});
    expect(response.statusCode).toBe(204);
    let cookie = response.headers['set-cookie'];

    response = await request(app)
      .get('/api/getQuizzes')
      .set('cookie', cookie);
    expect(response.statusCode).toBe(200);
  }).timeout(10000);
});






