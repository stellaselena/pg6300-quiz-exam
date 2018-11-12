/* eslint-disable no-console */
const crypto = require("crypto");

const QuizState = require('./quizState');
const ScoreState = require('./scoreState');
const ActivePlayers = require('../online/playersOnline');

class Match{

  constructor(firstPlayerId, secondPlayerId, callbackWhenFinished){

    this.quiz = new QuizState();
    this.score = new ScoreState();

    this.playerIds = [firstPlayerId, secondPlayerId];

    this.matchId = this.randomId();

    this.sockets = new Map();
    this.sockets.set(firstPlayerId, ActivePlayers.getSocket(firstPlayerId));
    this.sockets.set(secondPlayerId, ActivePlayers.getSocket(secondPlayerId));

    this.firstUser = firstPlayerId;

    this.callbackWhenFinished = callbackWhenFinished;

    this.nextRoundInterval = 0;
  }


  randomId(){
    return crypto.randomBytes(10).toString('hex');
  }

  start(){
    console.log("registering listeners and sending state to " + this.playerIds[0] + "," + this.playerIds[1] );

    this.registerListener(this.playerIds[0]);
    this.registerListener(this.playerIds[1]);

    this.sendInitialState(this.playerIds[0]);
    this.sendInitialState(this.playerIds[1]);
  }

  registerListener(userId){
    const socket = this.sockets.get(userId);

    socket.on('answer', data => {
      console.log("Handling answer from '" + data.userId+"' for round " + data.round
        + " in match " + this.matchId);

      if (data === null || data === undefined) {
        socket.emit("update", {error: "No payload provided"});
        return;
      }
      if(data.userId === undefined || data.userId === null){
        socket.emit("update", {error: "No userId provided"});
      }

      if(data.matchId !== this.matchId){
        console.log("Invalid matchId: "+data.matchId+" !== " + this.matchId);
        return;
      }
      if(data.round !== this.quiz.round){
        socket.emit("update", {error: "Invalid operation"});
        console.log("Invalid round: "+data.round+" !== " + this.quiz.round);
        return;
      }

      this.score.addUserScore(data.userId, data.round, data.answerSelected.score);

      let total = this.score.getTotalScore(data.userId);
      console.log(total);

    });

    socket.on('matchRequest', data => {
      if (data === null || data === undefined) {
        socket.emit("question", {error: "No payload provided"});
        return;
      }
      if(data.userId === undefined || data.userId === null){
        socket.emit("question", {error: "No userId provided"});
      }
      if(data.userId !== this.firstUser){
        socket.emit("question", {error: "This user cannot start the match"});
      }

      if(data.matchId !== this.matchId){
        console.log("Invalid matchId: "+data.matchId+" !== " + this.matchId);
        return;
      }

      this.quiz.nextRound(data.round);

      this.sendState(this.playerIds[0]);
      this.sendState(this.playerIds[1]);

      let round = data.round;

       this.nextRoundInterval = setInterval(() => {
        round++;
        this.quiz.nextRound(round);

        if(round >= 10){
          clearInterval(this.nextRoundInterval);
          this.score.getHighestScore(this.playerIds);

          this.sendFinishedState(this.playerIds[0]);
          this.sendFinishedState(this.playerIds[1]);

        } else {
          this.sendState(this.playerIds[0]);
          this.sendState(this.playerIds[1]);
        }

      }, 1000);

      if(this.quiz.isGameFinished()){
        this.callbackWhenFinished(this.matchId);
      }

    });
  }

  opponentId(userId){
    if(userId === this.playerIds[0]){
      return this.playerIds[1];
    }
    return this.playerIds[0];
  }

  sendInitialState(userId){

    console.log("Sending initial state to '" +userId+"' for match " + this.matchId);

    const payload = {
      data: {
        matchId: this.matchId,
        quizDto: this.quiz.extractDto(),
        isFirstPlayer: userId === this.firstUser,
        opponentId: this.opponentId(userId)
      }
    };

    const socket = this.sockets.get(userId);
    socket.emit('matchAvailable', payload);
  }

  sendFinishedState(userId){
    let status = "";
    if(userId === this.score.winner){
      status = "You won!";
    } else {
      status = "You lost!";
    }
    const payload = {
      data: {
        matchId: this.matchId,
        status: status,
        opponentId: this.opponentId(userId)
      }
    };

    const socket = this.sockets.get(userId);
    socket.emit('matchResult', payload);
  }

  sendState(userId){
    const payload = {
      data: {
        matchId: this.matchId,
        quizDto: this.quiz.extractDto(),
        isFirstPlayer: userId === this.firstUser,
        opponentId: this.opponentId(userId)
      }
    };

    const socket = this.sockets.get(userId);
    socket.emit('question', payload);

  }

  sendForfeit(userId){
    let status = userId + " has left the game. Match terminated.";

    const payload = {
      data: {
        matchId: this.matchId,
        status: status,
        opponentId: this.opponentId(userId)
      }
    };
    clearInterval(this.nextRoundInterval);
    const socket = this.sockets.get(this.opponentId(userId));
    socket.emit('matchResult', payload);

  }

}


module.exports = Match;

