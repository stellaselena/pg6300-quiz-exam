import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import cors from 'cors';

const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const auth = require('./routes/auth');
const quiz = require('./routes/quiz');
const category = require('./routes/category');
const match = require('./routes/match');
const Users = require('./db/users');

/*eslint-disable no-console */

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const compiler = webpack(config);

if (process.env.NODE_ENV !== 'production') {

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));


}

app.use(session({
  secret: 'a secret used to encrypt the session cookies',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public'));

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
  res.sendFile(path.join( __dirname, '../src/index.html'));
});

module.exports = app;
