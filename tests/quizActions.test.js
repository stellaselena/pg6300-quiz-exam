import expect from 'expect';
import * as quizActions from '../src/actions/quizActions';
import * as types from '../src/actions/actionTypes';

import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import 'babel-polyfill';


// Test a sync action
describe('Quiz Actions', () => {
  describe('createQuizSuccess', () => {
    it('should create a CREATE_QUIZ_SUCCESS action', () => {
      //arrange
      const quiz = {id: 'clean-code', question: 'Clean Code'};
      const expectedAction = {
        type: types.CREATE_QUIZ_SUCCESS,
        quiz: quiz
      };

      //act
      const action = quizActions.createQuizSuccess(quiz);

      //assert
      expect(action).toEqual(expectedAction);
    });
  });
});

// Test an async action
// const middleware = [thunk];
// const mockStore = configureMockStore(middleware);

// describe('Async Actions', () => {

//   afterEach(() => {
//     nock.cleanAll();
//   });

//   describe('Quiz Actions Thunk', () => {
//     it('should create BEGIN_AJAX_CALL and LOAD_QUIZZES_SUCCESS when loading quizzes', async (done) => {
//       nock('http://localhost:8080')
//         .get('/api/getQuizzes')
//         .reply(204, {quizzes: [{id: 'clean-code', question: 'Clean Code'}]});

//       const expectedActions = [
//         {type: types.BEGIN_AJAX_CALL},
//         {type: types.LOAD_QUIZZES_SUCCESS, body: {quizzes: [{id: 'clean-code', question: 'Clean Code'}]}}
//       ];
//       const store = mockStore({quizzes: []});
//       store.dispatch(quizActions.loadQuizzes()).then((result) => {
//         const actions = store.getActions();
//         expect(actions[0].type).toEqual(types.BEGIN_AJAX_CALL);
//         expect(actions[1].type).toEqual(types.LOAD_QUIZZES_SUCCESS);
//         done();
//       }).catch(done);
//     });
//   });
// });
