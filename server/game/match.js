const socketIo = require('socket.io');
const crypto = require("crypto");

const QuizState = require('./quizState');
const ActivePlayers = require('../online/playersOnline');

class Match{

  constructor(firstPlayerId, secondPlayerId, callbackWhenFinished){

    this.quiz = new QuizState();

    this.playerIds = [firstPlayerId, secondPlayerId];

    this.matchId = this.randomId();

    this.sockets = new Map();
    this.sockets.set(firstPlayerId, ActivePlayers.getSocket(firstPlayerId));
    this.sockets.set(secondPlayerId, ActivePlayers.getSocket(secondPlayerId));

    this.firstUser = firstPlayerId;

    this.callbackWhenFinished = callbackWhenFinished;
  }


  randomId(){
    return crypto.randomBytes(10).toString('hex');
  }

  start(){

    this.registerListener(this.playerIds[0]);
    this.registerListener(this.playerIds[1]);

    this.sendState(this.playerIds[0]);
    this.sendState(this.playerIds[1]);
  }

  registerListener(userId){

    const socket = this.sockets.get(userId);

    socket.removeAllListeners('begin');
    socket.removeAllListeners('answer');


    socket.on('answer', data => {

      if (data === null || data === undefined) {
        socket.emit("update", {error: "No payload provided"});
        return;
      }

      const round = data.round;
      const answer = data.answer;
      const score = data.score;
      const matchId = data.matchId;
      const userId = data.userId;

      console.log("Handling message from '" + userId+"' for round " + round
        + " in match " + this.matchId);

      const expectedRound = this.quiz.round;


      if(round !== expectedRound){
        socket.emit("update", {error: "Invalid operation"});
        console.log("Invalid round: "+round+" !== " + expectedRound);
        return;
      }

      if(matchId !== this.matchId){
        console.log("Invalid matchId: "+matchId+" !== " + this.matchId);
        return;
      }

      //update the state of the game

      this.sendState(this.opponentId(userId));

      if(this.quiz.isGameFinished()){
        this.callbackWhenFinished(this.matchId);
      }
    });

    socket.on('begin', data => {
      console.log("begin entered");
      // if (data === null || data === undefined) {
      //   socket.emit("update", {error: "No payload provided"});
      //   return;
      // }
      // if(data.userId === undefined || data.userId === null){
      //   socket.emit("update", {error: "No userId provided"});
      // }
      // if(data.userId !== this.firstUser){
      //   socket.emit("update", {error: "This user cannot start the match"});
      // }
      // console.log("Starting match " + this.matchId);

      setInterval(function(){
        socket.emit('question', "Question fired" );
      }, 5000);


    });
  }

  opponentId(userId){
    if(userId === this.playerIds[0]){
      return this.playerIds[1];
    }
    return this.playerIds[0];
  }

  sendInitialState(userId){

    console.log("Sending update to '" +userId+"' for match " + this.matchId);

    const payload = {
      data: {
        matchId: this.matchId,
        boardDto: this.quiz.extractDto(),
        isFirstPlayer: userId === this.firstUser,
        opponentId: this.opponentId(userId)
      }
    };

    const socket = this.sockets.get(userId);

    socket.emit('matchAvailable', payload);
  }

  sendForfeit(userId){

    this.quiz.doForfeit();
    this.sendState(this.opponentId(userId));
  }
}


module.exports = Match;

