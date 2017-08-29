const server_token_secret = 'QW$T#$%AGSD$46234tethqgahQ$Tq34raerghQ#YW$%YAERGQ#^q';
const jwt = require('jsonwebtoken');
const auth = require('./auth.db');
// Expose the authentication database
exports.db = auth.db;

//Middleware for token protected routes (API Routes)
exports.check = function (req, res, next) {
    if (!req.token) {
        return res.status(400).send('token required');
    }
    try {
        var decoded = jwt.verify(req.token, server_token_secret);
        var tokenExists = auth.db.get('currentTokens').includes(req.token).value();
        if(!tokenExists) throw new Error();
    } catch (err) {
        return res.status(400).send('invalid token');
    }
    next();
};
// Create a new token and store it in the authentication database
// This utility also cleans out any old tokens associated with this user
exports.create = function (req) {
    token = jwt.sign({
        id: req.body.username
    }, server_token_secret, {
        expiresIn: '1h'
    });
    remove(req.session.user);
    var tokens = auth.db.get('currentTokens').push(token).write();
    auth.db.get('secrets').find({name:req.session.user.name}).set('tokenIndex', tokens.length - 1).write();
    return token;
}
// Remove a current token when a user logs out
remove = function(user){
    var tokenIndex = auth.db.get('secrets').find(user).get('tokenIndex').value();
    auth.db.get('currentTokens').splice(tokenIndex, 1).write();
    auth.db.get('secrets').find(user).set('tokenIndex', false).write();
}
exports.remove = remove;