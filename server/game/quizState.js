const Quizzes = require('../db/quizzes');

class QuizState {
  constructor(dto){
    if(dto === null || dto === undefined){
      this.resetState();
    } else {
      this.round = dto.round;
    }
  }
}
