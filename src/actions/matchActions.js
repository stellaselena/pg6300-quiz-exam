import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';

export function loadRandomQuizSuccess(quiz) {
  return {type: types.LOAD_RANDOM_QUIZ_SUCCESS, quiz};
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
