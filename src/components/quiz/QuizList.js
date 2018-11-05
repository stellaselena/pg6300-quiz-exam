import React from 'react';
import PropTypes from 'prop-types';
import QuizListRow from './QuizListRow';

const QuizList = ({quizzes}) => {
  return (
    <table className="table">
      <thead>
      <tr>
        <th>Question</th>
        <th>Answer 1</th>
        <th>Answer 2</th>
        <th>Answer 3</th>
        <th>Answer 4</th>
        <th>Correct Answer</th>
        <th>Category</th>
      </tr>
      </thead>
      <tbody>
      {quizzes.map(quiz =>
        <QuizListRow key={quiz.id} quiz={quiz}/>
      )}
      </tbody>
    </table>
  );
};

QuizList.propTypes = {
  quizzes: PropTypes.array.isRequired
};

export default QuizList;
