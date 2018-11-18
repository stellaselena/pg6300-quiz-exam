const express = require('express');
const Matches = require('../db/matches');

const PlayerQueue = require('../online/playerQueue');
const ActivePlayers = require('../online/playersOnline');
const OngoingMatches = require('../online/ongoingMatches');

const router = express.Router();

router.post('/match', function (req, res) {
  if (!req.user) {
    res.status(401).send();
    return;
  }
  const created = Matches.createMatch(req.body.userId, req.body.score);
  if (!created) {
    res.status(400).send();
    return;
  }
  res.status(200).json({id: created});

});

router.put('/match', function (req, res) {
  if (!req.user) {
    res.status(401).send();
    return;
  }
  const updated = Matches.updateMatch(req.body.id, req.body.userId, req.body.score);
  if (!updated) {
    res.status(400).send();
    return;
  }
  res.status(204).send();

});

router.get('/matches', function (req, res) {
  if (!req.user) {
    res.status(401).send();
    return;
  }
  const matches = Matches.getMatches();
  res.status(200).json({matches: matches});
});

router.post('/matches', (req, res) => {

  if (!req.user) {
    res.status(401).send();
    return;
  }

  if (PlayerQueue.hasUser(req.user.id)) {
    res.status(204).send();
    return;
  }

  OngoingMatches.forfeit(req.user.id);

  const initialisedMatch = OngoingMatches.getInitialisedMatch();

  if (initialisedMatch.matchId !== 0) {

    OngoingMatches.addPlayerToMatch(initialisedMatch.matchId, req.user.id);

    res.status(201).send();
    return;
  }

  while (PlayerQueue.size() > 0) {
    const opponent = PlayerQueue.takeUser();
    if (!ActivePlayers.isActive(opponent)) {
      continue;
    }
    const playerIds = [req.user.id, opponent];
    OngoingMatches.initialiseMatch(playerIds);

    res.status(201).send();
    return;
  }

  PlayerQueue.addUser(req.user.id);
  res.status(200).json({firstUser: req.user.id});

});

router.post('/startMatch', (req, res) => {

  if (!req.user) {
    res.status(401).send();
    return;
  }

  let foundMatch = OngoingMatches.getMatchByLeadUser(req.user.id);

  if(foundMatch.matchId === 0){
    res.status(404).send();
    return;
  }

  OngoingMatches.startMatch(foundMatch.matchId);
  res.status(201).send();

});

module.exports = router;
