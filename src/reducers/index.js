import { combineReducers } from 'redux';
import quizzes from './quizReducer';
import categories from './categoryReducer';
import auth from './authReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
import match from './matchReducer';


const rootReducer = combineReducers({
  quizzes,
  categories,
  ajaxCallsInProgress,
  auth,
  match
});

export default rootReducer;
