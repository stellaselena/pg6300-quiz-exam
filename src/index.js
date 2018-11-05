import 'babel-core/register';
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import App from './components/App';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import './styles/styles.css';
import '../node_modules/jquery/dist/jquery';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/toastr/build/toastr.min.css';
import { getUser } from './actions/authActions';
import {loadQuizzes} from './actions/quizActions';
import {loadCategories} from './actions/categoryActions';
import {loadRandomQuiz} from './actions/matchActions';

const store = configureStore();

store.dispatch(loadQuizzes());
store.dispatch(loadCategories());
store.dispatch(getUser());

render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('app')
);
