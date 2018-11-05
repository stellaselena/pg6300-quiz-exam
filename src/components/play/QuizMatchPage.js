import React from 'react';
import PropTypes from 'prop-types';

const QuizMatchPage = ({question, answers, onNext, onAnswer, answerCorrect, disabled, score, timeLeft, round}) => {

  const background = (id) => {
    let color;
    if(answerCorrect.id === id){
      if(answerCorrect.correct){
        color = "btn btn-lg jumbotron-answer bg-success text-white";
      } else {
        color = "btn btn-lg jumbotron-answer bg-danger text-white";
      }
    } else {
      color = "btn btn-lg jumbotron-answer bg-dark text-white";
    }

    return color;
  };

  const buttonColor = (round) => {
    let color;
    if(round === 10){
      color = "btn btn-danger btn-md btn-randomQuiz";
    } else {
      color = "btn btn-primary btn-md btn-randomQuiz";
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
      <div className="col-md-2"/>
      <div className="col-md-8">
          <div className="jumbotron jumbotron-question bg-dark text-white"><h2>{question}</h2></div>
        </div>
        <div className="col-md-2"/>
      </div>
      <div className="row">
        <div className="col-md-6">
          <button className={background(0)} disabled={disabled} onClick={onAnswer}><h5>{answers[0]}</h5></button>
        </div>
        <div className="col-md-6">
          <button className={background(1)} disabled={disabled}  onClick={onAnswer}><h5>{answers[1]}</h5></button>
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
        <button className={buttonColor(round)} onClick={onNext} disabled={!disabled}><h4>{round === 10 ? "End match" : "Next question"}</h4></button>
      </div>
    </div>
   </div>

  );
};

QuizMatchPage.propTypes = {
  question: PropTypes.string.isRequired,
  answers: PropTypes.array.isRequired,
  onNext: PropTypes.func.isRequired,
  onAnswer: PropTypes.func.isRequired,
  answerCorrect: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
  timeLeft: PropTypes.number.isRequired,
  round: PropTypes.number.isRequired,



};

export default QuizMatchPage;
