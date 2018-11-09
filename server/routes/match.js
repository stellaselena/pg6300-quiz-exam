const express = require('express');
const Matches = require('../db/matches');

const PlayerQueue = require('../online/playerQueue');
const ActivePlayers = require('../online/playersOnline');
const OngoingMatches = require('../online/ongoingMatches');

const router = express.Router();

router.post('/saveMatch', function (req, res) {
  const created = Matches.createMatch(req.body.userId, req.body.score);
  if (!created) {
    res.status(400).send();
    return;
  }
  res.status(200).json({id: created});

});

router.put('/updateMatch', function (req, res) {
  const updated = Matches.updateMatch(req.body.id, req.body.userId, req.body.score);
  if (!updated) {
    res.status(400).send();
    return;
  }
  res.status(204).send();

});

router.get('/getMatches', function (req, res) {
  const matches = Matches.getMatches();
  res.status(200).json({matches: matches});
});

router.post('/matches', (req, res) => {

  if (!req.user) {
    res.status(401).send();
    return;
  }

  if(PlayerQueue.hasUser(req.user.id)){
    res.status(204).send();
    return;
  }

  OngoingMatches.forfeit(req.user.id);

  while (PlayerQueue.size() > 0) {

    const opponent = PlayerQueue.takeUser();
    if (!ActivePlayers.isActive(opponent)) {
      continue;
    }

    OngoingMatches.startMatch(req.user.id, opponent);

    res.status(201).send();
    return;
  }

  PlayerQueue.addUser(req.user.id);
  res.status(201).send();

});

module.exports = router;
