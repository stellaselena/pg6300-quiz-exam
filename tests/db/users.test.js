import expect from "expect";
const Users = require('../../server/db/users');


describe('Create a user and then find the created user', () => {
  it('Create a user and then find the created user', () => {
  Users.createUser("foo", "123");
  const foundUser = Users.getUser("foo");
  expect(foundUser.id).toBe("foo");
  });
});



