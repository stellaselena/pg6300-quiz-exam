const socketToUser = new Map();

const userToSocket = new Map();


function registerSocket(socket, userId){
  console.log("registering socket");
  socketToUser.set(socket.id, userId);
  userToSocket.set(userId, socket);
}

function removeSocket(socketId){
  console.log("removing socket");

  const userId = socketToUser.get(socketId);
  socketToUser.delete(socketId);
  userToSocket.delete(userId);
}


function removeUser(userId){
  console.log("removing user");

  const socketId = userToSocket.get(userId).id;
  userToSocket.delete(userId);
  socketToUser.delete(socketId);
}


function isActive(userId){
  console.log("calling is active " + userToSocket.has(userId));

  return userToSocket.has(userId);
}

function getSocket(userId){
  return userToSocket.get(userId);
}

function getUser(socketId){
  return socketToUser.get(socketId);
}

module.exports = {registerSocket, removeSocket, removeUser, isActive, getSocket, getUser};
