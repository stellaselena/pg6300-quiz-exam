class ScoreState {

  constructor(dto){
    if(dto === null || dto === undefined){
      this.resetState();
    } else {
      this.matchScore = dto.matchScore;
      this.winner = dto.winner;
    }
  }

  resetState() {
    this.matchScore  = [];
    this.winner = "";
  }

  extractDto() {
    return {
      matchScore: this.matchScore,
      winner: this.winner
    };
  }

  addUserScore(userId, round, score){
    let alreadyExists = this.matchScore.findIndex(
      el => el.userId === userId && el.round === round);

    if(alreadyExists === -1){
      const roundScore = {
        userId: userId,
        round: round,
        score: score
      };
      this.matchScore.push(roundScore);
    }
  }

  getTotalScore(userId){
    let totalScore = 0;
    this.matchScore.map(el => {
      if(el.userId === userId){
        totalScore += el.score;
      }
    });

    return totalScore;
  }

  getHighestScore(players){
    let highestScore = 0;
    players.forEach(player => {
      let userScore = this.getTotalScore(player);
      if(userScore > highestScore){
        highestScore = userScore;
        this.winner = player;
      }
    });

  }

}

module.exports = ScoreState;
