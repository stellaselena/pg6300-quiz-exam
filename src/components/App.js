import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Header from './common/Header';
import HomePage from './home/HomePage';
import QuizzesPage from './quiz/QuizzesPage';
import ManageQuizPage from './quiz/ManageQuizPage'; //eslint-disable-line import/no-named-as-default
import AboutPage from './about/AboutPage';
import NotFound from './common/NotFound';
import {connect} from 'react-redux';
import Login from './login/Login';
import Signup from './login/Signup';
import toastr from 'toastr';
import {bindActionCreators} from 'redux';
import * as authActions from "../actions/authActions";
import ManageQuizMatchPage from './play/ManageQuizMatchPage'; //eslint-disable-line import/no-named-as-default


class App extends React.Component {
  constructor(props){
    super(props);

    this.logout =this.logout.bind(this);

  }

  logout(event) {
    event.preventDefault();
    this.props.actions.logout()
      .then((response) => {
        if(response == 204){
          toastr.success('Logged out succesfully');
        } else toastr.error("Something went wrong");})
      .catch(error => {
        toastr.error(error);
      });
  }


  render() {

    return (
      <div className="">
        <Header
          loading={this.props.loading}
          userId={this.props.userId}
          logout={this.logout}
        />
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/play" component={ManageQuizMatchPage}/>
        <Route path="/quizzes" component={QuizzesPage}/>
        <Route path="/quiz/:id" component={ManageQuizPage}/>
        <Route path="/quiz" component={ManageQuizPage} exact />
        <Route path="/about" component={AboutPage}/>
        <Route component={NotFound}/>
      </Switch>

      </div>
    );
  }
}

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  match: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,

};

function mapStateToProps(state, ownProps) {
  return {
    loading: state.ajaxCallsInProgress > 0,
    userId: state.auth.userId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
