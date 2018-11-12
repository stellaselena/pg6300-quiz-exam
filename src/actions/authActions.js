import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';

export function loginSuccess(userId) {
  return {type: types.LOGIN_SUCCESS, userId};
}

export function websocketLoginSuccess(loggedIn) {
  return {type: types.WEBSOCKET_LOGIN_SUCCESS, loggedIn};
}

export function signUpSuccess(userId) {
  return {type: types.SIGN_UP_SUCCESS, userId};
}

export function logoutSuccess(userId) {
  return {type: types.LOGOUT_SUCCESS, userId};
}

export function getUserSuccess(userId){
  return{type: types.GET_USER_SUCCESS, userId};
}

export function getAdminSuccess(userId){
  return{type: types.GET_ADMIN_SUCCESS, userId};
}

export function getUser(){
  return async function (dispatch){
    dispatch(beginAjaxCall());
    const url = "api/user";
    const response = await fetch(url, { method: "get" });
    if (response.status === 401) {
      dispatch(getUserSuccess(""));
      return 401;
    }
    else if (response.status !== 200) {
      dispatch(ajaxCallError(response.status));
      return 401;
    }
    else {
      const payload = await response.json();
      dispatch(getUserSuccess(payload.userId));
      return 200;
    }
  };
}

export function getRole(){
  return async function (dispatch){
    dispatch(beginAjaxCall());
    const url = "api/admin";
    const response = await fetch(url, { method: "get" });
    if (response.status !== 200) {
      dispatch(ajaxCallError(response.status));
      return 401;
    }
    else {
      const payload = await response.json();
      dispatch(getAdminSuccess(payload.userId));
      return 200;
    }
  };
}

export function login(userId, password){
  return function (dispatch){
    dispatch(beginAjaxCall());
    const url = "api/login";
    const payload = {userId: userId, password: password};
    return fetch(url, {
      method: "post",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(payload)
    }).then( response => {
      if (response.status === 401) {
        dispatch(ajaxCallError("Invalid userId or password"));
        return 401;
      } else if(response.status !== 204) {
        dispatch(ajaxCallError("Error when connecting to server. Status code " + response.status));
        return 401;
      } else {
        dispatch(loginSuccess(userId));
        return 204;
      }
    });

  };
}

export function websocketLogin(socket){
  return async function (dispatch){
    dispatch(beginAjaxCall());
    const url = "/api/wstoken";
    return fetch(url, {
      method: "post"
    }).then(async response => {
      if (response.status === 401) {
        dispatch(ajaxCallError("Not logged in"));
        return 401;
      } else if(response.status !== 201) {
        dispatch(ajaxCallError("Error when connecting to server. Status code " + response.status));
        return 500;
      } else {
        const payload = await response.json();
        socket.emit('login', payload);
        dispatch(websocketLoginSuccess(true));
        return 201;
      }
    });

  };

}

export function signUp(userId, password){
  return function (dispatch){
    dispatch(beginAjaxCall());
    const url = "api/signup";
    const payload = {userId: userId, password: password};
    return fetch(url, {
      method: "post",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(function(response){
      if (response.status === 400) {
        dispatch(ajaxCallError("Invalid userId or password"));
        return 400;
      } else if(response.status !== 204) {
        dispatch(ajaxCallError("Error when connecting to server. Status code " + response.status));
        return 400;
      } else {
        dispatch(signUpSuccess(userId));
        return 204;
      }
    });

  };
}

export function logout(){
  return function (dispatch){
    dispatch(beginAjaxCall());
    const url = "api/logout";
    return fetch(url, {method: "post"}).then( response => {
      if (response.status !== 204) {
        dispatch(ajaxCallError("Something went wrong while logging out"));
        return 401;
      } else {
        dispatch(logoutSuccess(""));
        return 204;
      }

    });

  };
}

