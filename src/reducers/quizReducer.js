import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function quizzes(state = initialState.quizzes, action) {
  switch (action.type) {
    case types.LOAD_QUIZZES_SUCCESS:
      return action.quizzes;

    case types.CREATE_QUIZ_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.quiz)
      ];

    case types.UPDATE_QUIZ_SUCCESS:
      return state.map(
        quiz => (quiz.id === action.quiz.id ? action.quiz : quiz)
      );
      
    default:
      return state;
  }
}
