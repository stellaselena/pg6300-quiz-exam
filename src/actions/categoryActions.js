import * as types from './actionTypes';
import {ajaxCallError, beginAjaxCall} from './ajaxStatusActions';

export function loadCategoriesSuccess(categories) {
  return {type: types.LOAD_CATEGORIES_SUCCESS, categories};
}

export function loadCategories() {
  return async function (dispatch){
    dispatch(beginAjaxCall());
    const url = "api/categories";
    const response = await fetch(url, {
        method: "get",
        headers: {
          "Content-Type": 'application/json'
        }},
      );
      if (response.status !== 200) {
        dispatch(ajaxCallError(response.status));
        return response.status;
      } else {
        const payload = await response.json();
        dispatch(loadCategoriesSuccess(payload.categories));
        return 200;
      }

  };
}
