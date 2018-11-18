import expect from 'expect';
import categoryReducer from '../../src/reducers/categoryReducer';
import * as actions from '../../src/actions/categoryActions';

describe('Category Reducer', () => {
  it('should return categories when passed LOAD_CATEGORIES_SUCCESS', () => {
    const initialState = [];
    const categories = ["Programming", "JavaScript", ".NET", "Java"];
    const action = actions.loadCategoriesSuccess(categories);

    const newState = categoryReducer(initialState, action);

    expect(newState.length).toEqual(4);
  });

});
