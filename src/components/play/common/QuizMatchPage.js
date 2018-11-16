import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import QuizListRow from "../../quiz/QuizListRow";

const QuizMatchPage = ({question, answers, opponentsScore, canStart, onNext, onAnswer, answerCorrect, disabled, buttonHidden, score, timeLeft, round, onStart}) => {

  const background = (id) => {
    let color;
    if (answerCorrect.id === id) {
      if (answerCorrect.correct) {
        color = "btn btn-lg jumbotron-answer bg-success text-white";
      } else {
        color = "btn btn-lg jumbotron-answer bg-danger text-white";
      }
    } else {
      color = "btn btn-lg jumbotron-answer bg-info text-white";
    }

    return color;
  };

  const buttonColor = (round) => {
    let color;
    if (round === 10) {
      color = "btn btn-info btn-md btn-randomQuiz";
    } else {
      color = "btn btn-dark btn-md btn-randomQuiz";
    }

    return color;
  };

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-md-3">
          <h2 className="match-stats"><b>Time left: {timeLeft} s</b></h2>
        </div>
        <div className="col-md-6">
          <h2 className="match-stats"><b>Round: {round}/10</b></h2>

        </div>
        <div className="col-md-3">
          <h2 className="match-stats"><b>Score: {score}</b></h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3"/>
        <div className="col-md-6">
          <div className="jumbotron jumbotron-question bg-dark text-white"><h3>{question}</h3></div>
        </div>
        <div className="col-md-3">
          {!onNext &&
            <div className="match-stats text-center"><h2><b>Player rank</b></h2>
              <table className="table">
                <thead>
                <tr>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {opponentsScore && opponentsScore && opponentsScore.map(o =>
                <tr key={o.player}>
                  <td>{o.player}</td>
                  <td>{o.userScore}</td>
                </tr>
                )}
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <button className={background(0)} disabled={disabled} onClick={onAnswer}><h5>{answers[0]}</h5></button>
        </div>
        <div className="col-md-6">
          <button className={background(1)} disabled={disabled} onClick={onAnswer}><h5>{answers[1]}</h5></button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <button className={background(2)} disabled={disabled} onClick={onAnswer}><h5>{answers[2]}</h5></button>
        </div>
        <div className="col-md-6">
          <button className={background(3)} disabled={disabled} onClick={onAnswer}><h5>{answers[3]}</h5></button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {onNext ? <button className={buttonColor(round)}
                            onClick={onNext}
                            disabled={!disabled}>
              <h4>{round === 10 ? "End match" : "Next question"}</h4>
            </button> :
            <button className="btn btn-dark btn-md btn-randomQuiz"
                    onClick={onStart}
                    hidden={buttonHidden}
                    disabled={canStart}>
              <h4>Begin match</h4></button>
          }
        </div>
      </div>
    </div>

  );
};

QuizMatchPage.propTypes = {
  question: PropTypes.string.isRequired,
  answers: PropTypes.array.isRequired,
  onNext: PropTypes.func,
  onAnswer: PropTypes.func.isRequired,
  answerCorrect: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
  timeLeft: PropTypes.number.isRequired,
  round: PropTypes.number.isRequired,
  buttonHidden: PropTypes.bool,
  onStart: PropTypes.func,
  opponentsScore: PropTypes.array,
  canStart: PropTypes.func

};

export default QuizMatchPage;
