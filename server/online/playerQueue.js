//Code adapted https://github.com/arcuri82/pg6300/blob/master/les11/connect4-v2/src/server/online/player_queue.js


const queue = [];


function addUser(id){

  if(queue.includes(id)){
    return false;
  }

  queue.push(id);
  return true;
}


function size(){
  return queue.length;
}

function hasUser(id){
  return queue.includes(id);
}

function takeUser(){
  if(queue.length === 0){
    return null;
  }

  return queue.shift();
}


module.exports = {addUser, size, takeUser, hasUser};
