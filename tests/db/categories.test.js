import expect from "expect";
const Categories = require('../../server/db/categories');


describe('Get all categories', () => {
  it('Get all categories', () => {
    const categories = Categories.getAllCategories();
    expect(categories.length).toBe(4);
    expect(categories[0]).toBe("Programming");

  });
});
