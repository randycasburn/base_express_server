var express = require('express')
var router = express.Router()
const path = require('path');
const auth = require('./auth/auth.session');

// Unprotected routes 
//router.get('/', function (req, res) {
//    res.sendFile(path.join(__dirname + '/../client/dist/index.html'));
//});

router.post('/login', auth.login)
router.get('/logout', auth.logout);

module.exports = router;

