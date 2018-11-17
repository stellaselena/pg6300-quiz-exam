let matches = [];

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const generateId = (question) => {
  return replaceAll(question, ' ', '-');
};

function getMatch(id){
  return matches.find(match => match.id === id);

}

function getMatches(){
  return Object.values(matches);
}

function createMatch(userId, score){
  const id = generateId(userId + "-" + Date.now());
  if(getMatch(id) !== undefined ){
    return false;
  }
  const match = {
    id: id,
    userId: userId,
    score: score
  };
  matches.push(match);
  return match.id;
}

function updateMatch(id, userId, score){

  if(getMatch(id) === undefined ){
    return false;
  }
  const match = {
    id: id,
    userId: userId,
    score: score
  };
  const index = matches.findIndex(quiz => quiz.id === id);
  matches[index] = match;
  return true;
}

function resetMatches(){
  matches = [];
}

module.exports = {updateMatch, getMatches, createMatch, resetMatches};
