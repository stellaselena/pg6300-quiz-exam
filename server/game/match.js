/* eslint-disable no-console */
const crypto = require("crypto");

const QuizState = require('./quizState');
const ScoreState = require('./scoreState');
const ActivePlayers = require('../online/playersOnline');

class Match {

  constructor(playerIds, callbackWhenFinished) {

    this.quiz = new QuizState();
    this.score = new ScoreState();

    this.playerIds = playerIds;

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

  start() {
    console.log("registering listeners and sending state to players");
    this.playerIds.forEach(p => {
      this.registerListener(p);
      this.sendInitialState(p);
    });
  }

  registerListener(userId) {
    const socket = this.sockets.get(userId);

    socket.on('answer', data => {
      console.log("Handling answer from '" + data.userId + "' for round " + data.round
        + " in match " + this.matchId);

      if (data === null || data === undefined) {
        socket.emit("update", {error: "No payload provided"});
        return;
      }
      if (data.userId === undefined || data.userId === null) {
        socket.emit("update", {error: "No userId provided"});
      }

      if (data.matchId !== this.matchId) {
        console.log("Invalid matchId: " + data.matchId + " !== " + this.matchId);
        return;
      }
      if (data.round !== this.quiz.round) {
        socket.emit("update", {error: "Invalid operation"});
        console.log("Invalid round: " + data.round + " !== " + this.quiz.round);
        return;
      }

      this.score.addUserScore(data.userId, data.round, data.answerSelected.score);

      const answersForRound = this.score.answeredForRound(this.playerIds, this.quiz.round);
      const expectedAnswers = this.playerIds.length;

      if (answersForRound === expectedAnswers) {
        clearInterval(this.nextRoundInterval);

        setTimeout(() => {
          console.log("sendind q for round " + this.quiz.round);

          this.quiz.nextRound(this.quiz.round);

          this.playerIds.forEach(p => this.sendState(p));

          this.sendQuestion();
        }, 1000);

      }
    });

    socket.on('matchRequest', data => {
      if (data === null || data === undefined) {
        socket.emit("question", {error: "No payload provided"});
        return;
      }
      if (data.userId === undefined || data.userId === null) {
        socket.emit("question", {error: "No userId provided"});
      }
      if (data.userId !== this.firstUser) {
        socket.emit("question", {error: "This user cannot start the match"});
      }

      if (data.matchId !== this.matchId) {
        console.log("Invalid matchId: " + data.matchId + " !== " + this.matchId);
        return;
      }
      this.quiz.nextRound(0);

      this.playerIds.forEach(p => this.sendState(p));

      this.sendQuestion();
    });
  }

  opponentIds(userId) {
    return this.playerIds.filter(p => p !== userId);
  }

  sendInitialState(userId) {

    console.log("Sending initial state to '" + userId + "' for match " + this.matchId);

    const payload = {
      data: {
        matchId: this.matchId,
        quizDto: this.quiz.extractDto(),
        isFirstPlayer: userId === this.firstUser,
        opponentId: this.opponentIds(userId)
      }
    };

    const socket = this.sockets.get(userId);
    socket.emit('matchAvailable', payload);
  }

  sendFinishedState(userId) {
    let status = "";
    if (userId === this.score.winner) {
      status = "You won!";
    } else {
      status = "You lost!";
    }
    const payload = {
      data: {
        matchId: this.matchId,
        status: status,
        opponentId: this.opponentIds(userId)
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
        opponentId: this.opponentIds(userId)
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
        opponentId: this.opponentIds(userId)
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
      this.quiz.nextRound(round);

      if (round >= 10) {
        clearInterval(this.nextRoundInterval);
        this.score.getHighestScore(this.playerIds);

        this.playerIds.forEach(p => this.sendFinishedState(p));
      } else {
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

