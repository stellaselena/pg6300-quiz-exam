import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';
import cors from "cors";
const WsHandler = require('./ws/ws_handler');

const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const auth = require('./routes/auth');
const quiz = require('./routes/quiz');
const category = require('./routes/category');
const match = require('./routes/match');
const Users = require('./db/users');

const app = express();
app.use(cors());
app.use(compression());

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'a secret used to encrypt the session cookies',
  resave: false,
  saveUninitialized: false
}));

passport.use(new LocalStrategy(
  {
    usernameField: 'userId',
    passwordField: 'password'
  },
  function (userId, password, done) {

    const ok = Users.verifyUser(userId, password);

    if (!ok) {
      return done(null, false, {message: 'Invalid username/password'});
    }

    const user = Users.getUser(userId);
    return done(null, user);
  }
));


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {

  const user = Users.getUser(id);

  if (user !== null) {
    done(null, user);
  } else {
    done(null, false);
  }
});

app.use(passport.initialize());
app.use(passport.session());


app.use('/api', auth);
app.use('/api', quiz);
app.use('/api', category);
app.use('/api', match);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const server = require('http').Server(app);

/*eslint-disable no-console */

const port = process.env.PORT || 8080;

WsHandler.start(server);

server.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Starting NodeJS server');
    open(`http://localhost:${port}`);
  }
});
