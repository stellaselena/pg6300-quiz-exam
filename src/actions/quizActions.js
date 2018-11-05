import * as types from './actionTypes';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';

export function loadQuizzesSuccess(quizzes) {
  return {type: types.LOAD_QUIZZES_SUCCESS, quizzes};
}

export function createQuizSuccess(quiz) {
  return {type: types.CREATE_QUIZ_SUCCESS, quiz};
}

export function updateQuizSuccess(quiz) {
  return {type: types.UPDATE_QUIZ_SUCCESS, quiz};
}

export function loadQuizzes() {
  return async function (dispatch) {
    dispatch(beginAjaxCall());
    const url = "api/getQuizzes";
    await fetch(url, {
      method: "get",
      headers: {
        'Accept': 'application/json'
      }
    }).then(async response => {
      if (response.status === 200) {
        const payload = await response.json();
        dispatch(loadQuizzesSuccess(payload.quizzes));
        return 204;
      } else {
        dispatch(ajaxCallError(response.status));
        return 400;
      }
    });
  };
}

export function saveQuiz(quiz) {
  return async function (dispatch) {

    dispatch(beginAjaxCall());
    let payload;
    let url;
    let method;
    if (quiz.id === undefined || quiz.id === "") {
      payload = {
        question: quiz.question,
        answers: quiz.answers,
        correctAnswer: quiz.correctAnswer,
        category: quiz.category
      };
      url = "/api/saveQuiz";
      method = "post";
    } else {
      payload = {
        id: quiz.id,
        question: quiz.question,
        answers: quiz.answers,
        correctAnswer: quiz.correctAnswer,
        category: quiz.category
      };
      url = "/api/updateQuiz";
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
        quiz.id = payload.id;
        dispatch(createQuizSuccess(quiz));
        return 200;
      } else if (response.status === 204) {
        dispatch(updateQuizSuccess(quiz));
        return 204;
      }
      else {
        dispatch(ajaxCallError(response.status));
        return 400;
      }
    });
  };
}

