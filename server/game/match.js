/* eslint-disable no-console */
const crypto = require("crypto");

const QuizState = require('./quizState');
const ScoreState = require('./scoreState');
const ActivePlayers = require('../online/playersOnline');

class Match {

  constructor(playerIds, initialised, callbackWhenFinished) {

    this.quiz = new QuizState();
    this.score = new ScoreState();

    this.playerIds = playerIds;

    this.inProgress = initialised;

    this.matchId = this.randomId();

    this.sockets = new Map();

    this.playerIds.forEach(p => this.sockets.set(p, ActivePlayers.getSocket(p)));

    this.firstUser = playerIds.slice(-1)[0];

    this.callbackWhenFinished = callbackWhenFinished;

    this.nextRoundInterval = 0;
  }


  randomId() {
    return crypto.randomBytes(10).toString('hex');
  }

  initialise(){
    console.log("registering listeners and sending state to players");
    this.playerIds.forEach(p => {
      this.registerListener(p);
      this.sendInitialState(p);
    });
  }

  start() {
    this.inProgress = true;

    this.quiz.nextRound(0);

    this.playerIds.forEach(p => this.sendState(p));

    this.sendQuestion();
  }

  addPlayer(playerId){
    this.playerIds.forEach(p => this.sendNewPlayer(playerId, p));

    this.playerIds.push(playerId);

    this.sockets.set(playerId, ActivePlayers.getSocket(playerId));

    this.registerListener(playerId);
    this.sendInitialState(playerId);

  }

  sendNewPlayer(newPlayer, opponentId){
    const socket = this.sockets.get(opponentId);

    const payload = {
      data: {
        opponentId: newPlayer
      }
    };

    socket.emit("newPlayer", payload);

  }

  registerListener(userId) {
    const socket = this.sockets.get(userId);

    socket.removeAllListeners("answer");
    socket.removeAllListeners("message");

    socket.on('answer', data => {
      console.log("Handling answer from '" + data.userId + "' for round " + data.round
        + " in match " + this.matchId);

      if (data === null || data === undefined) {
        socket.emit("error", {error: "No payload provided"});
        return;
      }
      if (data.userId === undefined || data.userId === null) {
        socket.emit("error", {error: "No userId provided"});
      }

      if (data.matchId !== this.matchId) {
        console.log("Invalid matchId: " + data.matchId + " !== " + this.matchId);
        return;
      }
      if (data.round !== this.quiz.round) {
        socket.emit("error", {error: "Invalid operation"});
        console.log("Invalid round: " + data.round + " !== " + this.quiz.round);
        return;
      }

      this.score.addUserScore(data.userId, data.round, data.answerSelected.score);

      this.playerIds.forEach(p => this.sendScore(p));

      const answersForRound = this.score.answeredForRound(this.playerIds, this.quiz.round);

      const expectedAnswers = this.playerIds.length;

      if (answersForRound === expectedAnswers) {
        clearInterval(this.nextRoundInterval);
        if(this.quiz.round < 10){
          setTimeout(() => {
            this.quiz.nextRound(this.quiz.round);

            this.playerIds.forEach(p => this.sendState(p));

            this.sendQuestion();

          }, 1000);
        } else {
          clearInterval(this.nextRoundInterval);

          this.playerIds.forEach(p => this.sendFinishedState(p));
        }
      }
    });

    socket.on('message', data => {
      console.log("Received message from '" + data.userId
        + " in match " + this.matchId);

      if (data === null || data === undefined) {
        socket.emit("error", {error: "No payload provided"});
        return;
      }
      if (data.userId === undefined || data.userId === null) {
        socket.emit("error", {error: "No userId provided"});
      }

      if (data.matchId !== this.matchId) {
        console.log("Invalid matchId: " + data.matchId + " !== " + this.matchId);
        return;
      }

      if (data.message === null || data.message === undefined) {
        socket.emit("error", {error: "No payload provided"});
        return;
      }

      const payload = {
        userId: data.userId,
        message: data.message
      };

      this.playerIds.forEach(p => this.sendMessage(p, payload));

    });

  }

  opponentIds(userId) {
    return this.playerIds.filter(p => p !== userId);
  }
  sendMessage(userId, payload){
    console.log("Sending message to '" + userId);

    const socket = this.sockets.get(userId);

    socket.emit("newMessage", payload);
  }

  sendScore(userId){
    const socket = this.sockets.get(userId);

    const score = this.score.getHighestScore(this.playerIds);
    socket.emit("currentScore", score);
  }

  sendInitialState(userId) {

    const payload = {
      data: {
        matchId: this.matchId,
        quizDto: this.quiz.extractDto(),
        isFirstPlayer: userId === this.firstUser,
        opponentIds: this.opponentIds(userId)
      }
    };

    console.log("Sending initial state to '" + userId + "' for match " + this.matchId);

    const socket = this.sockets.get(userId);
    socket.emit('matchAvailable', payload);
  }

  sendFinishedState(userId) {
    const score = this.score.getHighestScore(this.playerIds);
    let status = "";
    if(score[0].player === userId){
      this.score.winner = userId;
      status = "You won!";
    } else {
      const position = score.findIndex(p => p.player === userId ) + 1;
      status = position + ". place. You lost!";
    }
    const payload = {
      data: {
        matchId: this.matchId,
        status: status,
        opponentIds: this.opponentIds(userId)
      }
    };

    const socket = this.sockets.get(userId);
    socket.emit('matchResult', payload);

    this.quiz.setStatus(1);
  }

  sendState(userId) {
    const payload = {
      data: {
        matchId: this.matchId,
        quizDto: this.quiz.extractDto(),
        isFirstPlayer: userId === this.firstUser,
        opponentIds: this.opponentIds(userId)
      }
    };

    const socket = this.sockets.get(userId);
    socket.emit('question', payload);

  }

  sendForfeit(userId) {
    let status = userId + " has left the game. Match terminated.";

    const payload = {
      data: {
        matchId: this.matchId,
        status: status,
        opponentIds: this.opponentIds(userId)
      }
    };
    clearInterval(this.nextRoundInterval);
    this.opponentIds(userId).forEach(o => {
      const socket = this.sockets.get(o);
      socket.emit('matchResult', payload);
    });

  }

  sendQuestion() {

    let round = this.quiz.round;

    this.nextRoundInterval = setInterval(() => {
      if (round >= 10) {
        clearInterval(this.nextRoundInterval);
        this.score.getHighestScore(this.playerIds);

        this.playerIds.forEach(p => this.sendFinishedState(p));
      } else {
        this.quiz.nextRound(round);
        this.playerIds.forEach(p => this.sendState(p));
        round++;

      }

    }, 10000);

    if (this.quiz.isGameFinished()) {
      this.callbackWhenFinished(this.matchId);
    }
  }

}


module.exports = Match;

