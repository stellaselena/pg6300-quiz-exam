import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function quizzes(state = initialState.match, action) {
  switch (action.type) {
    case types.LOAD_RANDOM_QUIZ_SUCCESS:
      return {
        ...state,
        quiz:action.quiz
      };
    default:
      return state;
  }
}
