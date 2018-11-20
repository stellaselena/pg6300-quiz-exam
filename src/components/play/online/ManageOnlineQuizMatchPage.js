import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as matchActions from '../../../actions/matchActions';
import * as authActions from '../../../actions/authActions';
import QuizMatchPage from '../common/QuizMatchPage';
import toastr from 'toastr';
import openSocket from 'socket.io-client';
import {PlayerOnline} from "./PlayerOnline";

class ManageOnlineQuizMatchPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      quiz: {
        id: '',
        question: 'Waiting for other players to join',
        answers: Array(4).fill(""),
        correctAnswer: '',
        category: ''
      },
      error: null,
      redirect: false,
      loading: true,
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
      inProgress: false,
      opponentIds: null,
      isFirstPlayer: false,
      canStart: false,
      opponentsScore: [],
      messages: [],
      message: "",
      initialised: false

    };

    this.checkForCorrectAnswer = this.checkForCorrectAnswer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.startMatch = this.startMatch.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.opponent = new PlayerOnline();

  }

  componentDidMount() {


    const userId = this.props.userId;

    if (userId === null) {
      this.setState({error: "You should login first"});
      return;
    }

    this.socket = openSocket(window.location.origin);

    this.opponent.setSocket(this.socket);

    this.props.actions.websocketLogin(this.socket).then(response => {
      if (response === 401) {
        this.setState({error: "You should log in first"});
      } else if (response === 201) {
        setTimeout(() => {
          this.props.actions.initialiseMatch().then(() => {
            this.setState({
              isFirstPlayer: this.props.firstPlayer === this.props.userId
            });
          });
        }, 500);

      } else {
        this.setState({error: "Error when connecting to server"});
      }
    });


    this.socket.on('disconnect', () => {
      this.setState({error: "Disconnected from Server"});
    });

    this.socket.on("matchAvailable", (dto) => {
      if (dto === null || dto === undefined) {
        this.setState({error: "Invalid response from server"});
        return;
      }

      if (dto.error !== null && dto.error !== undefined) {
        this.setState({error: dto.error});
        return;
      }

      const data = dto.data;

      let quiz = Object.assign({}, this.state.quiz);
      quiz.question =  data.isFirstPlayer ? "Match available. Press Begin Match to start!" : "Match will start soon.";

      this.setState({
        quiz: quiz,
        canStart: true,
        loading: true,
        matchId: data.matchId,
        opponentIds: data.opponentIds,
        isFirstPlayer: data.isFirstPlayer,
        initialised: true

      });

      this.opponent.setMatchId(data.matchId);
      if(this.state.isFirstPlayer){
        toastr.info("Player "+ this.state.opponentIds[0] + " has joined");
      }

    });

    this.socket.on("newPlayer", (dto) => {
      if (dto === null || dto === undefined) {
        this.setState({error: "Invalid response from server"});
        return;
      }

      const data = dto.data;

      toastr.info("Player " + data.opponentId + " has joined");
      this.setState({opponentIds:  [...this.state.opponentIds, data.opponentId]});

    });

    this.socket.on("newMessage", (dto) => {
      if (dto === null || dto === undefined) {
        this.setState({error: "Invalid response from server"});
        return;
      }

      this.setState({messages:  [...this.state.messages, dto]});

    });

    this.socket.on("currentScore", (dto) => {
      if (dto === null || dto === undefined) {
        this.setState({error: "Invalid response from server"});
        return;
      }
      this.setState({opponentsScore:  dto});

    });

    this.socket.on("error", (dto) => {
      this.setState({error: dto.error});

    });

    this.socket.on('question', (dto) => {
      clearInterval(this.interval);
      if (dto === null || dto === undefined) {
        this.setState({error: "Invalid response from server"});
        return;
      }

      if (dto.error !== null && dto.error !== undefined) {
        this.setState({error:  dto.error});
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
        canStart: false,
        loading: false,
        answerSelected,
        timeLeft: 10,
        round: data.quizDto.round
      });

      this.startTimer();

    });

    this.socket.on('matchResult', (dto) => {

      if (dto === null || dto === undefined) {
        this.setState({error: "Invalid response from server"});
        return;
      }

      if (dto.error !== null && dto.error !== undefined) {
        this.setState({error: dto.error});
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
      if(data.status.indexOf("won") !== -1){
        toastr.success("You won with a score of " + this.state.score);
      } else if(data.status.indexOf("terminated") !== -1){
        toastr.warning(data.status);
      } else {
        toastr.warning("You lost with a score of " + this.state.score);
      }
      setTimeout(() => {
        this.props.history.push("/");

      },1000);

    });

    this.opponent.setSocket(this.socket);

  }

  componentWillUnmount()  {
    this.socket.disconnect();
    clearInterval(this.interval);

  }

  startMatch() {
    this.props.actions.startMatch().then(() => {
      this.setState({
        inProgress: this.props.inProgress
      });
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.state.timeLeft > 0) {
        this.setState({timeLeft: this.state.timeLeft - 1});
      }
    }, 1000);
  }

  updateInput(event) {
    const message = event.target.value;
    this.setState({
      message: message
    });
  }

  onKeyPress(event){
    if (event.key === 'Enter') {
      this.opponent.sendMessage(this.props.userId, this.state.matchId, this.state.message);
      this.setState({
        message: ""
      });
    }

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
    if (this.state.error) {
        return (
          <div className="container text-center"><h1>{this.state.error}</h1>
          </div>
        );
    }

    if (!this.props.userId) {
      return (
        <div className="container text-center"><h1>You have to login or register first in order to play!</h1>
        </div>
      );
    }

    return (
      <div>
        <QuizMatchPage
          question={this.state.quiz.question}
          answers={this.state.quiz.answers}
          correctAnswer={this.state.quiz.correctAnswer}
          onAnswer={this.checkForCorrectAnswer}
          answerCorrect={this.state.answerSelected}
          disabled={this.state.loading}
          canStart={!this.state.canStart}
          opponentsScore={this.state.opponentsScore}
          buttonHidden={!this.state.isFirstPlayer}
          onStart={this.startMatch}
          score={this.state.score}
          timeLeft={this.state.timeLeft}
          round={this.state.round}
          messages={this.state.messages}
          onChange={this.updateInput}
          onKeyPress={this.onKeyPress}
          message={this.state.message}
          initialised={!this.state.initialised}
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
  firstPlayer: PropTypes.string,
  inProgress: PropTypes.bool,
  match: PropTypes.object
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
    firstPlayer: state.match.firstPlayer,
    inProgress: state.match.inProgress

  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, matchActions, authActions), dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageOnlineQuizMatchPage));
