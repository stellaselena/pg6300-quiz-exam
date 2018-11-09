const Match = require('../game/match');

const userIdToMatch = new Map();
const matchIdToMatch = new Map();

function startMatch(firstId, secondId){

  const match = new Match(firstId, secondId, deleteMatch);

  console.log("Starting a new match: '"+firstId+"' vs. '"+secondId+"', id = " + match.matchId);

  userIdToMatch.set(firstId, match);
  userIdToMatch.set(secondId, match);
  matchIdToMatch.set(match.matchId, match);

  match.start();
}

function deleteMatch(matchId){
  const match = matchIdToMatch.get(matchId);
  if(match === undefined){
    return;
  }

  match.playerIds.forEach(id => userIdToMatch.delete(id));
  matchIdToMatch.delete(match.matchId);
}

function forfeit(userId){

  const match = userIdToMatch.get(userId);
  if(match === undefined){
    return;
  }

  match.playerIds.forEach(id => userIdToMatch.delete(id));
  matchIdToMatch.delete(match.matchId);

  match.sendForfeit(userId);
}



module.exports = {startMatch, forfeit};
