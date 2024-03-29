import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function auth(state = initialState.websocketAuth, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        userId: action.userId
      });
    case types.WEBSOCKET_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        websocketAuth: action.loggedIn
      });
    case types.SIGN_UP_SUCCESS:
      return Object.assign({}, state, {
        userId: action.userId
      });
    case types.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        userId: action.userId
      });
    case types.GET_USER_SUCCESS:
      return Object.assign({}, state, {
        userId: action.userId
      });
    case types.GET_ADMIN_SUCCESS:
      return Object.assign({}, state, {
        userId: action.userId
      });
    default:
      return state;
  }
}
