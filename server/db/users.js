
//Dummy db, without proper way of handling passwords
//Code adapted from https://github.com/arcuri82/pg6300/blob/master/les11/connect4-v2/src/server/db/users.js

const admin = {
  id: "admin",
  password: "admin"
};
const users = new Map([["admin", admin]]);


function getUser(id){
    return users.get(id);
}

function verifyUser(id, password){

    const user = getUser(id);

    if(user === undefined){
        return false;
    }

    return user.password === password;
}

function createUser(id, password){

    if(getUser(id) !== undefined ){
        return false;
    }

    const user = {
        id: id,
        password: password
    };

    users.set(id, user);
    return true;
}

function resetAllUsers(){
    users.clear();
}


module.exports = {getUser, verifyUser, createUser, resetAllUsers};
