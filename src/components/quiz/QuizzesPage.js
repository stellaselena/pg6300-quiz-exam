import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as quizActions from '../../actions/quizActions';
import QuizList from './QuizList';

class QuizzesPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.redirectToAddQuizPage = this.redirectToAddQuizPage.bind(this);
  }

  redirectToAddQuizPage() {
    this.props.history.push('/quiz');
  }



  render() {
    return (
      <div className="container">
        <h1>Quizzes</h1>
        <input type="submit"
               value="Add Quiz"
               className="btn btn-primary"
               onClick={this.redirectToAddQuizPage}/>

        <QuizList quizzes={this.props.quizzes}/>
      </div>
    );
  }
}

QuizzesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  quizzes: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    quizzes: state.quizzes
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(quizActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QuizzesPage));
