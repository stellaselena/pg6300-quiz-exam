import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
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
        correct: false,
        round: 0,
        score: 0,
      },
      score: 0,
      timeLeft: 10,
      round: 0,
      matchId: null,
      initialised: false,
      opponentId: null,
      isFirstPlayer: false

    };

    this.checkForCorrectAnswer = this.checkForCorrectAnswer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.startMatch = this.startMatch.bind(this);
    this.opponent = new PlayerOnline();

  }

  componentDidMount() {
    let errors = {};
    const userId = this.props.userId;

    if (userId === null) {
      errors.loginErr = "You should login first";
      this.setState({errors: errors});
      return;
    }

    if (this.state.matchId === null) {
      let quiz = Object.assign({}, this.state.quiz);
      quiz.question = "Waiting for other players to join";

      this.setState({
        quiz: quiz,
        loading: true
      });
    }

    this.socket = openSocket(window.location.origin);

    this.socket.on('disconnect', () => {
      let errors = {};
      errors.disconnected = "Disconnected from Server";
      this.setState({errors: errors});
    });

    this.socket.on("matchAvailable", (dto) => {
      let errors = {};
      errors.serverError = "Invalid response from server";
      if (dto === null || dto === undefined) {
        this.setState({errors: errors});
        return;
      }

      if (dto.error !== null && dto.error !== undefined) {
        errors.dtoError = dto.error;
        this.setState({errors: errors.dtoError});
        return;
      }

      const data = dto.data;

      let quiz = Object.assign({}, this.state.quiz);
      debugger;
      quiz.question =  data.isFirstPlayer ? "Match available. Press Begin Match to start!" : "Match will start soon.";

      this.setState({
        quiz: quiz,
        loading: true,
        matchId: data.matchId,
        opponentId: data.opponentId,
        isFirstPlayer: data.isFirstPlayer

      });

      this.opponent.setMatchId(data.matchId);

    });

    this.socket.on('question', (dto) => {
      let errors = {};
      clearInterval(this.interval);
      if (dto === null || dto === undefined) {
        errors.serverError = "Invalid response from server";
        this.setState({errors: errors});
        return;
      }

      if (dto.error !== null && dto.error !== undefined) {
        errors.dtoError = dto.error;
        this.setState({errors: errors});
        return;
      }

      const data = dto.data;
      let quiz = Object.assign({}, data.quizDto.quiz);

      let answerSelected = Object.assign({}, this.state.answerSelected);
      answerSelected.id = "";
      answerSelected.correct = false;
      answerSelected.score = 0;

      this.setState({
        quiz: quiz,
        loading: false,
        answerSelected,
        timeLeft: 10,
        round: data.quizDto.round
      });

      this.startTimer();

    });

    this.socket.on('matchResult', (dto) => {




      let errors = {};
      if (dto === null || dto === undefined) {
        errors.serverError = "Invalid response from server";
        this.setState({errors: errors});
        return;
      }

      if (dto.error !== null && dto.error !== undefined) {
        errors.dtoError = dto.error;
        this.setState({errors: errors});
        return;
      }

      const data = dto.data;
      let quiz = Object.assign({}, this.state.quiz);
      quiz.answers = Array(4).fill("");
      quiz.question = data.status;

      let answerSelected = Object.assign({}, this.state.answerSelected);
      answerSelected.id = "";
      answerSelected.correct = false;
      answerSelected.score = 0;

      this.setState({
        quiz: quiz,
        answerSelected,
        loading: true,
        timeLeft: 0
      });
      debugger;
      if(data.status.indexOf("won") !== -1){
        toastr.success("You won with a score of " + this.state.score);
      } else if(data.status.indexOf("terminated") !== -1){
        toastr.warning(data.status);
      } else {
        toastr.warning("You lost with a score of " + this.state.score);
      }
      setTimeout(() => {
        this.props.history.push("/");

      },5000);

    });

    this.props.actions.websocketLogin(this.socket).then(response => {
      let errors = {};
      if (response === 401) {
        errors.websocketError = "You should log in first";
        this.setState({errors: errors});
        return;
      } else if (response !== 201) {
        errors.websocketError = "Error when connecting to server";
        this.setState({errors: errors});
        return;
      } else {
        this.props.actions.startMatch();
      }
    });

    this.opponent.setSocket(this.socket);

  }

  componentWillUnmount() {
    this.socket.disconnect();
    clearInterval(this.interval);

  }

  startMatch() {
    this.socket.emit('matchRequest', {
      userId: this.props.userId,
      matchId: this.state.matchId,
      round: this.state.round
    });
    this.setState({
      initialised: this.props.initialised
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.state.timeLeft > 0) {
        this.setState({timeLeft: this.state.timeLeft - 1});
      }
    }, 1000);
  }

  checkForCorrectAnswer(event) {
    event.preventDefault();
    clearInterval(this.interval);

    const answer = event.target.textContent;
    const answerIndex = this.state.quiz.answers.indexOf(answer);
    const correctAnswer = this.state.quiz.answers[this.state.quiz.correctAnswer];

    let totalScore = answer === correctAnswer ? this.state.score + this.state.timeLeft : this.state.score;
    const currentScore = answer === correctAnswer ? this.state.timeLeft : 0;


    let answerSelected = Object.assign({}, this.state.answerSelected);
    answerSelected.id = answerIndex;
    answerSelected.correct = answer === correctAnswer;
    answerSelected.round = this.state.round;
    answerSelected.score = currentScore;

    answer === correctAnswer ? toastr.success('Correct!')
      : toastr.warning('Wrong answer!');

    this.setState({
      loading: true,
      answerSelected,
      score: totalScore
    });

    this.opponent.sendAnswer(this.props.userId, this.state.matchId, this.state.round, answerSelected);

  }

  render() {

    if (!this.props.userId) {
      return (
        <div className="container text-center"><h1>You have to login or register first in order to play!</h1>
        </div>
      );
    }

    if (this.state.errors.length > 0) {
      {
        this.state.errors.map((error, i) => {
          return (
            <div key={i}><h2>{error.valueOf()}</h2></div>
          );
        });
      }
    }

    return (
      <div>
        <OnlineQuizMatchPage
          question={this.state.quiz.question}
          answers={this.state.quiz.answers}
          correctAnswer={this.state.quiz.correctAnswer}
          onAnswer={this.checkForCorrectAnswer}
          answerCorrect={this.state.answerSelected}
          answerDisabled={this.state.loading}
          buttonHidden={!this.state.isFirstPlayer || this.state.initialised}
          onStart={this.startMatch}
          score={this.state.score}
          timeLeft={this.state.timeLeft}
          round={this.state.round}
        />
      </div>

    );
  }
}

ManageOnlineQuizMatchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  quiz: PropTypes.object.isRequired,
  userId: PropTypes.string,
  matchLog: PropTypes.array,
  initialised: PropTypes.bool,
};

function mapStateToProps(state, ownProps) {
  let quiz;
  if (state.match.quiz) {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageOnlineQuizMatchPage));
