import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as quizActions from '../../actions/quizActions';
import QuizForm from './QuizForm';
import Forbidden from '../common/Forbidden';
import {categoriesFormattedForDropdown, correctAnswersFormattedForDropdown} from '../../selectors/selectors';
import toastr from 'toastr';


export class ManageQuizPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      quiz: Object.assign({}, this.props.quiz),
      errors: {},
      saving: false,
      redirect: false
    };

    this.saveQuiz = this.saveQuiz.bind(this);
    this.updateQuizState = this.updateQuizState.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.quiz.id != state.quiz.id) {
      return props.quiz;
    }
    return null;
  }

  updateQuizState(event) {
    const field = event.target.name;
    // Fix: Clone state to avoid manipulating below.
    let quiz = Object.assign({}, this.state.quiz);

    if(field.includes("answer_")){
      let answerIndex = field.split("_").pop();
      let updatedAnswers = this.state.quiz.answers.slice();
      updatedAnswers[answerIndex] = event.target.value;
      quiz["answers"] = updatedAnswers;
    } else {
      quiz[field] = event.target.value;
    }
    return this.setState({quiz: quiz});
  }

  quizFormIsValid() {
    let formIsValid = true;
    let errors = {};

    if (this.state.quiz.question.length < 5) {
      errors.question = 'Question must be at least 5 characters.';
      formIsValid = false;
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  saveQuiz(event) {
    event.preventDefault();

    if (!this.quizFormIsValid()) {
      return;
    }

    this.setState({saving: true});
    this.props.actions.saveQuiz(this.state.quiz)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
  }

  redirect() {
    this.setState({saving: false, redirect: true});
    toastr.success('Quiz saved.');
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/quizzes" />;
    }
    if (this.props.userId === "admin") {
      return (
        <QuizForm
          quiz={this.state.quiz}
          onChange={this.updateQuizState}
          onSave={this.saveQuiz}
          errors={this.state.errors}
          allCategories={this.props.categories}
          allCorrectAnswers = {this.props.correctAnswers}
          saving={this.state.saving}
        />
      );
    } else {
      return <Forbidden/>;
    }

  }
}

ManageQuizPage.propTypes = {
  quiz: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  correctAnswers: PropTypes.array.isRequired,
  userId: PropTypes.string
};

function getQuizById(quizzes, id) {
  const quiz = quizzes.filter(quiz => quiz.id == id);
  if (quiz) return quiz[0]; 
  return null;
}

function mapStateToProps(state, ownProps) {
  const quizId = ownProps.match.params.id; // from the path `/quiz/:id`

  let quiz = {id: '', question: '', answers: Array(4).fill(""), correctAnswer: '', category: ''};

  if (quizId && state.quizzes.length > 0) {
    quiz = getQuizById(state.quizzes, quizId);
  }

  return {
    userId: state.auth.userId,
    quiz: quiz,
    categories: categoriesFormattedForDropdown(state.categories),
    correctAnswers: correctAnswersFormattedForDropdown([1,2,3,4])

  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(quizActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageQuizPage);
