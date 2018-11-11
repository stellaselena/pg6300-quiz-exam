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
    console.log("registering listeners and sending state to " + this.playerIds[0] + "," + this.playerIds[1] );

    this.registerListener(this.playerIds[0]);
    this.registerListener(this.playerIds[1]);

    this.sendInitialState(this.playerIds[0]);
    this.sendInitialState(this.playerIds[1]);
  }

  registerListener(userId){
    console.log("registering listener");
    const socket = this.sockets.get(userId);

    socket.on('answer', data => {

      console.log("answer received");

      // this.socket.on('question', (dto) => {
      //   this.socket.emit('answer', {
      //     userId: this.props.userId,
      //     matchId: this.state.matchId,
      //     round: this.state.round,
      //     answerSelected: this.state.answerSelected
      //   });

      if (data === null || data === undefined) {
        socket.emit("question", {error: "No payload provided"});
        return;
      }
      if(data.userId === undefined || data.userId === null){
        socket.emit("question", {error: "No userId provided"});
      }

      if(data.matchId !== this.matchId){
        console.log("Invalid matchId: "+data.matchId+" !== " + this.matchId);
        return;
      }

      console.log(data.answerSelected);
      console.log(this.quiz.extractDto());

      console.log("Handling message from '" + data.userId+"' for round " + data.round
        + " in match " + this.matchId);

      const expectedRound = this.quiz.round;
      const quiz = this.quiz.quiz;
      console.log("quiz" + quiz);

      if(data.round !== expectedRound){
        socket.emit("update", {error: "Invalid operation"});
        console.log("Invalid round: "+data.round+" !== " + expectedRound);
        return;
      }
      //update the state of the game
      //todo create map for users answer score

      // this.sendState(this.opponentId(userId));

    });

    socket.on('matchRequest', data => {
      console.log("matchRequest entered");
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

      let nextRoundInterval = setInterval(() => {
        round++;
        this.quiz.nextRound(round);

        if(round >= 10){
          clearInterval(nextRoundInterval);
        } else {
          this.sendState(this.playerIds[0]);
          this.sendState(this.playerIds[1]);
        }

      }, 15000);

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
    console.log("emiting match available");
    socket.emit('matchAvailable', payload);
  }

  sendState(userId){
    console.log("Sending question round for match " + this.matchId);

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

    this.quiz.doForfeit();
    this.sendState(this.opponentId(userId));
  }


}


module.exports = Match;

