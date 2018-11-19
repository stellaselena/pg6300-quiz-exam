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

    sendMessage(userId, matchId, message) {
      this.socket.emit('message', {
        userId: userId,
        matchId: matchId,
        message: message
      });
    }
}
