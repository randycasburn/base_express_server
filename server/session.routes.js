var express = require('express')
var router = express.Router()
const auth = require('./auth/auth.session');
//Session based auth
// middleware that is specific to this router
// authenticates users based upon session status
router.use(auth.restrict);
// A simple test route to ensure session authenctation works
router.get('/restricted', function (req, res) {
    res.send('Wahoo! restricted area, click to <a href="/logout">logout</a><pre>'+ JSON.stringify(auth.db.get('users').find({name:req.session.name})) + '</pre>');
});
// made this as a session based authenction for adding users 
// could be REST based too.
router.post('/users/create', auth.restrict, auth.createUser);

module.exports = router;
