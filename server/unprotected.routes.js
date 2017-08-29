var express = require('express')
var router = express.Router()
const auth = require('./auth/auth.session');

// Unprotected routes 
router.get('/', function (req, res) {
    res.send('post to login with username / password');
});

router.post('/login', auth.login)
router.get('/logout', auth.logout);

module.exports = router;

