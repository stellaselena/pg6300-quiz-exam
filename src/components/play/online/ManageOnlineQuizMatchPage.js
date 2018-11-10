import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import * as matchActions from '../../../actions/matchActions';
import * as authActions from '../../../actions/authActions';
import OnlineQuizMatchPage from './OnlineQuizMatchPage';
import toastr from 'toastr';
import openSocket from 'socket.io-client';
import {PlayerOnline} from "./PlayerOnline";

class ManageOnlineQuizMatchPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      quiz: {
        id: '',
        question: '',
        answers: Array(4).fill(""),
        correctAnswer: '',
        category: ''
      },
      errors: {},
      redirect: false,
      loading: false,
      answerSelected: {
        id: "",
        correct: false
      },
      score: 0,
      timeLeft: 0,
      round: 0,
      matchId: 0,
      initialised: false
    };

    this.getRandomQuiz = this.getRandomQuiz.bind(this);
    this.endMatch = this.endMatch.bind(this);
    this.checkForCorrectAnswer = this.checkForCorrectAnswer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.saveMatch = this.saveMatch.bind(this);

    this.opponent = new PlayerOnline();
    this.startMatch = this.startMatch.bind(this);

  }

  componentDidMount(){
    debugger;
    let errors = {};
    const userId = this.props.userId;

    //User not logged in
    if (userId === null) {
      errors.loginErr = "You should login first";
      this.setState({errors: errors});
      return;
    }

    //Match not started
    if (this.state.matchId === 0) {
      let quiz = Object.assign({}, this.state.quiz);
      quiz.question = "Waiting for other players to join";

      this.setState({
        quiz: quiz,
        loading: true
      });
    }

    this.socket = openSocket(window.location.origin);

    this.socket.on('disconnect', () => {
      this.setState({errorMsg: "Disconnected from Server."});
    });

    //login with websocket
    this.props.actions.websocketLogin(this.socket).then(response => {
      debugger;
      let errors = {};
      if(response === 401){
        errors.websocketError = "You should log in first";
        this.setState({errors: errors});
        return;
      }
      if(response !== 201){
        errors.websocketError = "Error when connecting to server";
        this.setState({errors: errors});
        return;
      }

      //initialise match
      this.props.actions.startMatch().then(() => {
      this.setState({
        initialised: this.props.initialised
      });

      });
  })};


  componentWillUnmount() {
    this.socket.disconnect();
  }

  startMatch(){
  }

  startTimer(){
    this.interval = setInterval(() => {
      if(this.state.timeLeft > 0){
        this.setState({timeLeft: this.state.timeLeft -1 });
      } else {
        let quiz = Object.assign({}, this.state.quiz);
        quiz.question = "You ran out of time!";
        this.setState({
          loading: true,
          quiz
        });
        clearInterval(this.interval);
      }
    }, 1000);
  }

  saveMatch(){
    let match ={
      userId: this.props.userId,
      score: this.state.score
    };
    this.props.actions.saveMatch(match);
  }

  getRandomQuiz(event){
    event.preventDefault();

    let answerSelected = Object.assign({}, this.state.answerSelected);
    answerSelected.id = "";
    answerSelected.correct = false;

    this.props.actions.loadRandomQuiz().then(() => {
      this.setState({
        quiz: this.props.quiz,
        loading: false,
        answerSelected,
        timeLeft: 15,
        round: this.state.round + 1
      });
    });

    this.startTimer();

  }

  endMatch(event){
    event.preventDefault();
    this.saveMatch();
    toastr.info("Match ended! Score " + this.state.score);
    this.props.history.push('/');

  }

  checkForCorrectAnswer(event){
    event.preventDefault();

    clearInterval(this.interval);

    const answer = event.target.textContent;
    const answerIndex = this.state.quiz.answers.indexOf(answer);
    const correctAnswer = this.state.quiz.answers[this.state.quiz.correctAnswer];

    let answerSelected = Object.assign({}, this.state.answerSelected);
    answerSelected.id = answerIndex;
    answerSelected.correct = answer === correctAnswer;

    answer === correctAnswer ? toastr.success('Correct!')
      : toastr.warning('Wrong answer!');

    let quiz = Object.assign({}, this.state.quiz);
    quiz.question = "Fetching question...";

    let score = answer === correctAnswer ? this.state.score + this.state.timeLeft : this.state.score;

    this.setState({
      loading: true,
      answerSelected,
      quiz,
      score
    });

  }


  render(){

  if (!this.props.userId) {
    return <div className="container text-center"><h1>You have to login or register first in order to play!</h1></div>;
  }

  if (this.state.errors.length > 0) {
    <div><h2>Error</h2></div>
    {
      this.state.errors.map(error => {
        return (
          <div><h2>{error.valueOf()}</h2></div>
        );
      })
    }
  }

  return (
    <div>
      <OnlineQuizMatchPage
        question={this.state.quiz.question}
        answers={this.state.quiz.answers}
        correctAnswer={this.state.quiz.correctAnswer}
        onNext={this.state.round === 10 ? this.endMatch : this.startMatch}
        onAnswer={this.checkForCorrectAnswer}
        answerCorrect={this.state.answerSelected}
        answerDisabled={this.state.loading}
        buttonDisabled={this.state.matchId === 0}
        score={this.state.score}
        timeLeft={this.state.timeLeft}
        round={this.state.round}
      />
    </div>

  )}
}

ManageOnlineQuizMatchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  quiz: PropTypes.object.isRequired,
  userId: PropTypes.string,
  matchLog: PropTypes.array
};

function mapStateToProps(state, ownProps){
  let quiz;
  if(state.match.quiz){
    quiz = state.match.quiz;
  } else {
    quiz = {id: '', question: '', answers: Array(4).fill(""), correctAnswer: '', category: ''};
  }
  return {
    quiz: quiz,
    userId: state.auth.userId,
    match: state.match,
    initialised: state.match.initialised

  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, matchActions, authActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ManageOnlineQuizMatchPage));
