const express = require('express')
const token = require('./auth/auth.token');
const router = express.Router();

// Token based auth middleware for all routes here
router.use(token.check);
// if we get here the token is god
router.get('/users', function (req, res, next) {
    res.send(token.db.get('users').value());
});

module.exports = router;