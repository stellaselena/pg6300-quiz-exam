# PG6300 Quiz exam

### Travis
[![Build Status](https://travis-ci.com/stellaselena/pg6300-quiz-exam.svg?token=xqfmXCaJoqxaqpsVZGP3&branch=master)](https://travis-ci.com/stellaselena/pg6300-quiz-exam)

### Heroku
[Link to heroku app](https://stella-quiz-app.herokuapp.com)

### Repository
[Link to repository](https://github.com/stellaselena/PG6300-quiz-exam)

## About the application
The topic of the application is about an online, multi-player quiz game. A registered user can either play alone or online.

In addition to exam requirements, I added features such as:
- Admin quiz administration page
  - Administrators have the possibility to add new quizzes or update existing ones
- Single player quiz match
- High score board for online matches
- Chat for online matches

### Online match

If X wishes to play online, X can initialise a new match and wait for other players to join. 

Once there are enough other players (at least 1), X will be able to start the match. 

Each time when a new player enters the initialised match, other players will be notified.

Each match consists of 10 rounds, where players get points based on correct answers and how long they take to answer.

#### High score

When a player select an answer for a current round, the high score board will be updated and sorted by players score. 

At the end of the 10th round, a player with most points will be declared as the winner.

#### Chat

When a match is initialised, players will be able to send messages to each other.

### Single player match

In order to play, a user has to register first.

### Quiz management page
Login as admin (`username: admin, password: admin`) to access quiz management page.
 
New quizzes can be added or existing quizzes can be updated from the quiz management page.

## Endpoints

| **Path** | **Description** |
|----------|-------
|`POST` /login| requires userId & password
|`POST` /signup| requires userId & password
|`POST` /logout| 
|`POST` /wstoken| returns a random token for current user
|`POST` /user	| return current users id
|`GET` /categories| returns all categories
|`GET` /quizzes | returns all quizzes 
|`GET` /randomQuiz | returns a random quiz 
|`POST` /quiz | requires admin, question, answers, correct answer and category, returns id
|`PUT` /quiz | requires admin, id, question, answers, correct answer and category 
|`POST` /match | requires user to be logged in, userId & score, returns match id 
|`PUT` /match | requires user to be logged in, matchId ,userId & score
|`POST` /matches | requires user to be logged in, if queue is not empty match will be initialised with player from queue / player will be added to the initialised match
|`POST` /startmatch | requires user to be logged in and first player who initiated the match

## How to
1. `npm install` to install dependencies
2. `npm run dev` (dev)
3. `npm run test` (runs all tests) (optional)
4. `npm run jest` (measure coverage with Jest) (optional)
5. `npm start` (prod) (optional)

## Technologies used

| **Dependencies** | **Usage**  |
|----------|-------
|babel-polyfill| Polyfill
|enzyme|  Testing utilities
|eslint| JS Linter
|express| Serves development and production builds
|jest	| Testing library
|mocha| Testing library
|react | React library 
|react-dom|DOM rendering 
|react-redux|Connecting React to Redux 
|react-router|Routing 
|react-router-redux|Keep React Router in sync with Redux
|redux| Redux library 
|redux-thunk| Async redux library
|socket.io| Real-time bidirectional event-based communication
|webpack| Bundler with plugin system and integrated dev server
|webpack-dev-middleware	| Webpack middleware support 
|webpack-hot-middleware	| webpack hot reloading

These are some of dependencies used for this project in addition to other libraries.
  
### Boilerplate & Code provided in class
- https://github.com/arcuri82/pg6300.
  - Some of the code was adapted from the main repository of the PG6300 course. Refer to the comments in the code stating which code has been adapted from the course.
- https://github.com/coryhouse/pluralsight-redux-starter
  - React & Redux boilerplate. Some of the code was adapted during initial setup, such as babel, hot reloading and linting.

### Challenges
I experienced some weird behaviour when running tests on my laptop, they would randomly fail
with a timeout error. I tried to reproduce the error
on other machines and Jenkins but to no avail. An ugly way of solving this issue is to either add
a --timeout flag in the test script or to manually add timeout to functions to increase the default timeout of Mocha.

### Improvements
- Add websocket tests
- Implement redux socket middleware
- Connect to a real database using Docker
