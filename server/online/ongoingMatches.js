/* eslint-disable no-console */
const Match = require('../game/match');

const userIdToMatch = new Map();
const matchIdToMatch = new Map();

function startMatch( matchId){
  const match = matchIdToMatch.get(matchId);
  console.log("Starting match:" +  match.matchId);

  match.start();
}

function initialiseMatch(playerIds){
  const match = new Match(playerIds, false, deleteMatch);

  console.log("Initialising a new match:" +  match.matchId);

  playerIds.forEach(p => userIdToMatch.set(p, match));
  matchIdToMatch.set(match.matchId, match);
  console.log(playerIds);
  match.initialise();
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
    if(e.hasOwnProperty("inProgress") && e["inProgress"] === false){
      initialisedMatch.matchId =  e["matchId"];
      initialisedMatch.playerIds =  e["playerIds"];
      initialisedMatch.firstUser =  e["firstUser"];
    }
  });

  return initialisedMatch;
}

function getMatchByLeadUser(firstUser){
  let initialisedMatch = {
    matchId: 0
  };
  matchIdToMatch.forEach(e => {
    if(e.hasOwnProperty("firstUser") && e["firstUser"] === firstUser){
      initialisedMatch.matchId =  e["matchId"];
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


module.exports = {startMatch, forfeit, initialiseMatch, getInitialisedMatch, addPlayerToMatch, getMatchByLeadUser};
