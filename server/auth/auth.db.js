const hash = require('pbkdf2-password')()
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const auth = require('./auth.session');
const adapter = new FileSync('./server/auth/db.json')
const db = low(adapter);

/*
This app uses lowDb from https://github.com/typicode/lowdb 
lowDb is a sinmple file based DB that uses lodash.js as it's query foundation

exports db, createUser
*/ 

// Initialize DB
// If db doesn't exist, this will create an empty db
db.defaults({users:[], secrets:[],currentTokens:[]}).write()
if(db.get('users').value().length == 0){
    createUser({name:'mock'},'mock');
}
exports.db = db;

// when you create a user, generate a salt
// and hash the password 
function createUser(user, password){
    db.get('users').push(user).write();
    createHash(user, password);
    return db.get('users').find(record=>record.name === user.name);
}
exports.createUser = createUser;

function createHash(user, password){
    db.get('secrets').push({"name":user.name}).write();
    hash({
        password: password
    }, function (err, pass, salt, hash) {
        if (err) throw err;
        // store the salt & hash in the "db"
        db.get('secrets')
        .find({ name: user.name })
        .assign({ salt: salt, hash: hash, tokenIndex: false})
        .write()
    });
}
