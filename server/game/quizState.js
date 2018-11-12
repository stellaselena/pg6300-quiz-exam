const Quizzes = require('../db/quizzes');

class QuizState {

  constructor(dto){
    if(dto === null || dto === undefined){
      this.resetState();
    } else {
      this.round = dto.round;
      this.quiz = dto.quiz;
      this.status = dto.status;
    }
  }

  resetState() {
    this.round = 0;
    this.quiz = {};
    this.status = 0;
  }

  extractDto() {
    return {
      round: this.round,
      quiz: this.quiz,
      status: this.status
    };
  }

  isGameFinished() {
    return this.status === 1;
  }

  setStatus(status) {
    return this.status = status;
  }

  nextRound(round){
    this.round = round + 1;
    this.quiz =  Quizzes.getRandomQuiz();
  }


}

module.exports = QuizState;
