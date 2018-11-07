const express = require('express');
const Matches = require('../db/matches');

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

module.exports = router;
