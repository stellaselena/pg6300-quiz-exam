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
  console.log("taking user from queue " + queue);
  if(queue.length === 0){
    return null;
  }

  return queue.shift();
}


module.exports = {addUser, size, takeUser, hasUser};
