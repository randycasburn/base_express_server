const jsonServer = require('json-server')
const app = jsonServer.create()
const jsonServerRouter = jsonServer.router('./server/REST/db.json')
const middlewares = jsonServer.defaults({static:'../client/dist/'});
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bearerToken = require('express-bearer-token');
const session = require('express-session');
const token = require('./auth/auth.token');
const unprotectedRoutes = require('./unprotected.routes');
const sessionRoutes = require('./session.routes');
const tokenRoutes = require('./token.routes');
const helmet = require('helmet');
var livereload = require('livereload');
//const app = module.exports = express();

// middleware
app.use(middlewares)
app.use(helmet());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.text()); // for parsing text
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(bearerToken()); // for automatically pulling the Authorization: Bearer token from the header
// Provides session management
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'asdf!%ARYW%YW$@$%T#W5234526tq35ARGTr46wu7'
}));
app.disable('x-powered-by');
/*
 Routing is designed to support Single Page Applications. 
 That means only the '/' route actually returns HTML to the browser.
 All other routes simply return JSON
 */
app.use(require('connect-inject')());

app.use(express.static(path.join(__dirname + '/../client/dist')));

/*
 The base routes: '/', '/login', '/logout'
 App authentication is via session based auth
 Tokens (API Keys) are generated at each login to be used for REST API calls
 */
app.use('/', unprotectedRoutes);
// All RESTful services are accessed via Token based authentication
//app.use('/api', tokenRoutes);
// Standard session based authentication routes - there aren't any in a SPA
app.use('/', sessionRoutes);

app.use(token.check);
app.use('/api', jsonServerRouter);
// Catchall 404 route with JSON response
app.use(function (req, res) {
    res.status(404);
    res.send({
        error: "Resource not found"
    });
});
const open = require('open');
/* istanbul ignore next */
app.listen(3000, () => {
    open('http://localhost:3000', function(e){console.log(e)});
  console.log('JSON Server is running on port 3000');
})
var lrserver = livereload.createServer(null,  () => {
    console.log("Watching files at " + path.join(__dirname, "../client/dist"));
});
lrserver.watch(path.join(__dirname, "../client/dist"));

