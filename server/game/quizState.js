const Quizzes = require('../db/quizzes');

class QuizState {

  constructor(dto){
    if(dto === null || dto === undefined){
      this.resetState();
    } else {
      this.round = dto.round;
      this.quiz = dto.quiz;
    }
  }

  resetState() {
    this.round = 0;
    this.quiz = {};
  }

  extractDto() {
    return {
      round: this.round,
      quiz: this.quiz
    };
  }

  isGameFinished() {
    return this.round > 10;
  }

  nextRound(round){
    this.round = round + 1;
    this.quiz =  Quizzes.getRandomQuiz();
  }

}

module.exports = QuizState;
