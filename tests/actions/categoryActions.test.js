import expect from 'expect';
import * as categoryActions from '../../src/actions/categoryActions';
import * as types from '../../src/actions/actionTypes';
import 'babel-polyfill';

describe('Category Actions', () => {
  describe('loadCategoriesSuccess', () => {
    it('should create a LOAD_CATEGORIES_SUCCESS action', () => {
      const categories = ["Programming", "JavaScript", ".NET", "Java"];
      const expectedAction = {
        type: types.LOAD_CATEGORIES_SUCCESS,
        categories: categories
      };

      const action = categoryActions.loadCategoriesSuccess(categories);

      expect(action).toEqual(expectedAction);
    });
  });
});
