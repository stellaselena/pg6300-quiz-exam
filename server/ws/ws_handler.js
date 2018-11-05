const socketIo = require('socket.io');
const Tokens = require('./tokens');


/*eslint-disable no-console*/
let io;

const start = (server) => {

    io = socketIo(server);

    io.on('connection', function(socket){
        socket.on('login', (data) => {
            if(data === null || data === undefined){
                return;
            }

            const token = data.wstoken;

            if(token === null || token === undefined){
                socket.emit("update", {error: "Missing token"});
                return;
            }

            const userId = Tokens.consumeToken(token);

            if(userId === null || userId === undefined){
                socket.emit("update", {error: "Invalid token"});
                return;
            }

            console.log("User '"+userId+"' is now connected with a websocket.");
        });

        socket.on('disconnect',  () => {

            console.log("User is disconnected.");
        });
    });
};


module.exports = {start};