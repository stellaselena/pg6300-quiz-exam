import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const QuizListRow = ({quiz}) => {

  return(
    <tr>
      <td><Link to={'/quiz/' + quiz.id}>{quiz.question}</Link></td>
      {quiz.answers && quiz.answers.map((answer,i) => <td key={i}>{answer}</td>)}
      <td>{Number(quiz.correctAnswer) + 1}</td>
      <td>{quiz.category}</td>
    </tr>
  );
};

QuizListRow.propTypes = {
  quiz: PropTypes.object.isRequired
};

export default QuizListRow;
