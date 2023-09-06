const express = require("express");
const server = express();
const routes = require("./routes");

const morgan = require("morgan");
const session = require("express-session");

const bodyParser = require("body-parser");
const passport = require("passport");
const { PRIVATE_SECRET } = require("./config/config");

server.use(bodyParser.json({limit: '100mb'}));
server.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
server.use(morgan('dev'));

server.use((req, res, next) => {
  console.log('request from:', req.headers.origin);
  console.log('method:', req.method);
  console.log('route:', req.url);

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
server.use(session({
  secret: PRIVATE_SECRET,
  resave: false,
  saveUninitialized: false
}));
server.use(passport.initialize());
server.use(passport.session());
server.get('/', (req,res) => { res.status(200).send('Server listening...')});
server.use('/', routes);

module.exports = server;
