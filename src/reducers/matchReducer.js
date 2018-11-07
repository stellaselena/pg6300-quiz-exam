import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function quizzes(state = initialState.match, action) {
  switch (action.type) {
    case types.LOAD_MATCHES_SUCCESS:
      return {
        ...state,
        matchLog: action.matches

      };

    case types.CREATE_MATCH_SUCCESS:
      return {
        ...state,
        matchLog: [
          ...state.matchLog,
          Object.assign({}, action.match)
        ]
      };
    case types.UPDATE_MATCH_SUCCESS:
      return state.map(
        match => (match.id === action.match.id ? action.match : match)
      );

    case types.LOAD_RANDOM_QUIZ_SUCCESS:
      return {
        ...state,
          quiz:action.quiz
      };

    default:
      return state;
  }
}
