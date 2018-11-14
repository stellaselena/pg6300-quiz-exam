# PG6300 Quiz exam

### Travis
[![Build Status](https://travis-ci.com/stellaselena/pg6300-quiz-exam.svg?token=xqfmXCaJoqxaqpsVZGP3&branch=master)](https://travis-ci.com/stellaselena/pg6300-quiz-exam)

### Heroku
[Link to heroku app](https://stella-quiz-app.herokuapp.com)

### Repository
[Link to repository](https://github.com/stellaselena/PG6300-quiz-exam)

## About the application:
The topic of the application is about an online, multi-player quiz game. A registered user can either play alone or online.

##### Online match

If X wishes to play online, X can initialise a new match and wait for other players to join. 

Once there are enough other players (at least 1), X will be able to start a match. 

Each match consists of 10 rounds, where players get points based on correct answers and how long they take to answer.

At the end of the 10th round, a player with most points will be declared as the winner.

##### Singleplayer match

In order to play, a user has to register first.

##### Quiz management page
Login as admin (`username: admin, password: admin`) to access quiz management page.
 
New quizzes can be added or existing quizzes can be updated from the quiz management page.

## How to
1. `npm install` (dependency installation depends on internet speed & hardware, in my case it takes around 1 minute)
2. `npm start`
3. `npm run test` (runs all tests)
3. `npm run jest` (measure coverage with Jest)

### Technologies used
| **Dependencies** | **Usage**  |
|----------|-------|
|babel-polyfill| Polyfill for features that cannot be transpiled|
|enzyme|  Testing utilities for React|
|eslint| JS Linter|
|express| Serves development and production builds
|jest	| Testing library
|mocha| Testing library
|react | React library |
|react-dom|DOM rendering |
|react-redux|Connecting React components to Redux |
|react-router|Routing |
|react-router-redux|Keep React Router in sync with Redux|
|redux| Redux library |
|redux-thunk| Async redux library|
|socket.io| Real-time bidirectional event-based communication|
|webpack| Bundler with plugin system and integrated dev server
|webpack-dev-middleware	| Webpack middleware support 
|webpack-hot-middleware	| webpack hot reloading

These are some of the main dependencies used for this project, in addition to some other useful libraries.
  
#### Boilerplate
Boilerplate for React + Redux, with Babel, hot reloading and linting adapted from
https://github.com/coryhouse/pluralsight-redux-starter.

#### Code provided in class
Some of the code was adapted from the main repository of the PG6300 course: https://github.com/arcuri82/pg6300.
Refer to the comments in the code stating which code has been adapted from the course.

#### Challenges
I experienced some weird behaviour when running tests, they would randomly fail
with a timeout error. This occurred only on certain machines. I tried to reproduce the error
on other machines and Jenkins but to no avail. An ugly way of solving this issue is to either add
a --timeout flag in the test script or to manually add timeout to functions and increase the default timeout of Mocha.
