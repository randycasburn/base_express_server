const hash = require('pbkdf2-password')()
const token = require('./auth.token');
const auth = require('./auth.db');
/*
A Classic session based authentication backend that can be used 
with Single Page Applications for authentication and user management.

One difference is that it also creates a token to be used as a 
Bearer token by the client. This Bearer token is then used to
provide API access for a RESTful API Backend.

exports db, createUser, login, logout & restrict router middleware
*/

// Expose the authentication db
exports.db = auth.db;
/*
Calls createUser in the session auth module 

returns the new user
*/
exports.createUser = function(req, res, next){
    let newUser = auth.createUser(req.body.username, req.body.password);
    res.send(newUser);
}

/*
Authencates a user against a stored hash/salt combiniation.
Also creates a token to be used with the RESTful API backend.

on success returns the new user object along with the Bearer token
on failure returns an error string
*/
exports.login = function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {
            // Regenerate session when signing in to prevent fixation
            req.session.regenerate(function () {
                req.session.user = user;
                req.token = token.create(req);
                res.status(200).send({
                    user: user,
                    token: req.token
                });
            });
        } else {
            return res.status(400).send(`Authentication failed, please check your username and password. (use "randy" and "foobar")`);
        }
    });
};
/*
Logs the user out by destroying the session and makes a request
to remove the assigned Bearer token
*/
exports.logout = function (req, res) {
    token.remove(req.session.user);
    req.session.destroy(function () {
        res.send('logged out');
    });
};

// Authentication work is done here
let authenticate = function(name, pass, fn) {
    var user = auth.db.get('secrets').find({ name: name }).value();
    if (!user) return fn(new Error('cannot find user'));
    hash({
        password: pass,
        salt: user.salt
    }, function (err, pass, salt, hash) {
        if (err) return fn(err);
        if (hash == user.hash) {
            let user = auth.db.get('users').find({name:name}).value();
            return fn(null, user);
        }
        fn(new Error('invalid password'));
    });
}
/*
This is the Router middleware function that ensures a user is logged in prior to
accessing restricted content.
*/
exports.restrict = function(req, res, next) {
    if(!req.session.user || auth.db.get('secrets').has({ name:req.session.user.name}).value()) {
        return res.status(401).send('Access denied');
    }
    next();
    
};