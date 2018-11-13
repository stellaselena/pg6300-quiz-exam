/* eslint-disable no-console */
const Match = require('../game/match');

const userIdToMatch = new Map();
const matchIdToMatch = new Map();

function startMatch(playerIds){

  const match = new Match(playerIds, deleteMatch);

  console.log("Starting a new match:" +  match.matchId);
  playerIds.forEach(p => userIdToMatch.set(p, match));
  matchIdToMatch.set(match.matchId, match);

  match.start();
}

function initialiseMatch(playerIds){
  const match = new Match(playerIds, false, deleteMatch);

  console.log("Initialising a new match:" +  match.matchId);

  playerIds.forEach(p => userIdToMatch.set(p, match));
  matchIdToMatch.set(match.matchId, match);
}

function addPlayerToMatch(matchId, playerId){
  const match = matchIdToMatch.get(matchId);
  match.addPlayer(playerId);

  matchIdToMatch.set(match.matchId, match);
  userIdToMatch.set(playerId, match);
}

function getInitialisedMatch(){
  let initialisedMatch = {
    matchId: 0,
    playerIds: [],
    firstUser: null,
  };
  matchIdToMatch.forEach(e => {
    if(e.hasOwnProperty("initialised") && e["initialised"] === false){
      initialisedMatch.matchId =  e["matchId"];
      initialisedMatch.playerIds =  e["playerIds"];
      initialisedMatch.firstUser =  e["firstUser"];
    }
  });

  return initialisedMatch;
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



module.exports = {startMatch, forfeit, initialiseMatch, getInitialisedMatch, addPlayerToMatch};
