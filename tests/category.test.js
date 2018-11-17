import request from 'supertest';

const app = require("../server/app");
import React from 'react';
import expect from 'expect';

/*eslint-disable no-console */
const errorHandler = function (err, req, res, next) {
  console.log(err.stack);
  res.send(500);
};
app.use(errorHandler);

describe("Test get categories", () => {

  it('Get categories', async () => {

    let response = await request(app)
      .get('/api/getCategories');
    expect(response.statusCode).toBe(200);
    expect(response.body.categories.length).toBe(4);

  }).timeout(10000);

});






