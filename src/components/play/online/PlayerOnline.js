

export  class PlayerOnline{

    setSocket(socket){
        this.socket = socket;
    }

    setMatchId(matchId){
        this.matchId = matchId;
    }

    playNext(answer, currentQuiz){

        if(answer === null || answer=== undefined){
            return;
        }

        const quizState = currentQuiz.getState();

        this.socket.emit('answer', {
            round: quizState.round,
            answer: answer,
            matchId: this.matchId
        });
    }

}
