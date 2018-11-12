import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';

export function loadRandomQuizSuccess(quiz) {
  return {type: types.LOAD_RANDOM_QUIZ_SUCCESS, quiz};
}

export function createMatchSuccess(match) {
  return {type: types.CREATE_MATCH_SUCCESS, match};
}

export function updateMatchSuccess(match) {
  return {type: types.UPDATE_MATCH_SUCCESS, match};
}

export function loadMatchesSuccess(matches) {
  return {type: types.LOAD_MATCHES_SUCCESS, matches};
}

export function startMatchSuccess(success) {
  return {type: types.START_MATCH_SUCCESS, success};
}

export function startMatch(){
  return async function (dispatch) {
    dispatch(beginAjaxCall());
    const url = "api/matches";
    await fetch(url, {
      method: "post"
    }).then(response => {
      if (response.status === 201 || response.status === 204) {
        dispatch(startMatchSuccess(true));
      } else if(response.status === 401) {
        dispatch(ajaxCallError("You should login first"));
      } else {
        dispatch(ajaxCallError("Error when connecting to server"));
      }
    });
  };
}


export function loadRandomQuiz() {
  return async function (dispatch) {
    dispatch(beginAjaxCall());
    const url = "api/getRandomQuiz";
    await fetch(url, {
      method: "get",
      headers: {
        'Accept': 'application/json'
      }
    }).then(async response => {
      if (response.status === 200) {
        const payload = await response.json();
        dispatch(loadRandomQuizSuccess(payload.quiz));
        return payload.quiz;
      } else {
        dispatch(ajaxCallError(response.status));
        return 404;
      }
    });
  };
}

export function loadMatches() {
  return async function (dispatch) {
    dispatch(beginAjaxCall());
    const url = "api/getMatches";
    await fetch(url, {
      method: "get",
      headers: {
        'Accept': 'application/json'
      }
    }).then(async response => {
      if (response.status === 200) {
        const payload = await response.json();
        dispatch(loadMatchesSuccess(payload.matches));
        return 200;
      } else {
        dispatch(ajaxCallError(response.status));
        return 400;
      }
    });
  };
}

export function saveMatch(match) {
  return async function (dispatch) {

    dispatch(beginAjaxCall());
    let payload;
    let url;
    let method;
    if (match.id === undefined || match.id === "") {
      payload = {
        userId: match.userId,
        score: match.score
      };
      url = "/api/saveMatch";
      method = "post";
    } else {
      payload = {
        id: match.id,
        userId: match.userId,
        score: match.score
      };
      url = "/api/updateMatch";
      method = "put";
    }
    await fetch(url, {
      method: method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": 'application/json'
      }
    }).then(async response => {
      if (response.status === 200) {
        const payload = await response.json();
        match.id = payload.id;
        dispatch(createMatchSuccess(match));
        return 200;
      } else if (response.status === 204) {
        dispatch(updateMatchSuccess(match));
        return 204;
      }
      else {
        dispatch(ajaxCallError(response.status));
        return 400;
      }
    });
  };
}
