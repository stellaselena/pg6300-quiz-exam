import expect from 'expect';
import * as quizActions from '../../src/actions/quizActions';
import * as types from '../../src/actions/actionTypes';
import 'babel-polyfill';

describe('Quiz Actions', () => {
  describe('createQuizSuccess', () => {
    it('should create a CREATE_QUIZ_SUCCESS action', () => {
      const quiz = {id: 'clean-code', question: 'Clean Code'};
      const expectedAction = {
        type: types.CREATE_QUIZ_SUCCESS,
        quiz: quiz
      };

      const action = quizActions.createQuizSuccess(quiz);

      expect(action).toEqual(expectedAction);
    });
  });
});
