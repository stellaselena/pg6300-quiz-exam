import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import * as matchActions from '../../actions/matchActions';
import QuizMatchPage from './QuizMatchPage';
import toastr from 'toastr';

class ManageQuizMatchPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      quiz: this.props.quiz,
      errors: {},
      redirect: false,
      loading: false,
      answerSelected: {
        id: "",
        correct: false
      },
      score: 0,
      timeLeft: 15,
      round: 0
    };

    this.getRandomQuiz = this.getRandomQuiz.bind(this);
    this.endMatch = this.endMatch.bind(this);
    this.checkForCorrectAnswer = this.checkForCorrectAnswer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.saveMatch = this.saveMatch.bind(this);
  }

  static getDerivedStateFromProps(props, state) {

    if (props.quiz.id != state.quiz.id) {
      return props.quiz;
    }

    return null;
  }

  componentDidMount(){
    this.props.actions.loadRandomQuiz().then(() => {
      this.setState({
        quiz: this.props.quiz,
        round: this.state.round + 1
      });
    });

    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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


  render() {
    if (!this.state.quiz.id){
      return <div className="container text-center"><h1>Loading...</h1></div>;
    }

    if (!this.props.userId){
      return <div className="container text-center"><h1>You have to login or register first in order to play!</h1></div>;
    }

    return (
        <div>
          <QuizMatchPage 
          question={this.state.quiz.question}
          answers={this.state.quiz.answers}
          correctAnswer={this.state.quiz.correctAnswer}
          onNext={this.state.round === 10 ? this.endMatch : this.getRandomQuiz}
          onAnswer={this.checkForCorrectAnswer}
          answerCorrect={this.state.answerSelected}
          disabled={this.state.loading}
          score={this.state.score}
          timeLeft={this.state.timeLeft}
          round={this.state.round}
        />
        </div>
        
    );
  }
}

ManageQuizMatchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  quiz: PropTypes.object.isRequired,
  userId: PropTypes.string,
  matchLog: PropTypes.array
};

function mapStateToProps(state, ownProps){
  return {
    quiz: state.match.quiz,
    userId: state.auth.userId,
    match: state.match.matchLog
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(matchActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ManageQuizMatchPage));
