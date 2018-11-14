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
    } else {
      return 0;
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

    const playersTotalScore = [];

    players.forEach(player => {
      let userScore = this.getTotalScore(player);
      playersTotalScore.push({player, userScore});
    });

    const sortedTotalScore = playersTotalScore.sort((p1,p2) => {
      return p1.userScore- p2.userScore;
    });

    return sortedTotalScore.reverse();

  }

  answeredForRound(players, round){
    let answers = 0;
    players.forEach(player => {
      this.matchScore.map(el => {
        if(el.userId === player && el.round === round){
          answers += 1;
        }
      });
    });

    return answers;
  }

}

module.exports = ScoreState;
