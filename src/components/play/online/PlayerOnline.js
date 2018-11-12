

export  class PlayerOnline{

    setSocket(socket){
        this.socket = socket;
    }

    setMatchId(matchId){
        this.matchId = matchId;
    }

    sendAnswer(userId, matchId, round, answerSelected){
      this.socket.emit('answer', {
        userId: userId,
        matchId: matchId,
        round: round,
        answerSelected: answerSelected
      });

    }
}
