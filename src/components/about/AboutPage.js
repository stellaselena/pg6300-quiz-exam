import React from 'react';

class AboutPage extends React.Component {
    render() {
        return (
            <div className="container">
              <h1 id="pg6300-quiz-exam">PG6300 Quiz exam</h1>
              <h3 id="travis">Travis</h3>
              <p><a href="https://travis-ci.com/stellaselena/pg6300-quiz-exam"><img src="https://travis-ci.com/stellaselena/pg6300-quiz-exam.svg?token=xqfmXCaJoqxaqpsVZGP3&amp;branch=master" alt="Build Status"/></a></p>
              <h3 id="heroku">Heroku</h3>
              <p><a href="https://stella-quiz-app.herokuapp.com">Link to heroku app</a></p>
              <h3 id="repository">Repository</h3>
              <p><a href="https://github.com/stellaselena/PG6300-quiz-exam">Link to repository</a></p>
              <h2 id="about-the-application-">About the application</h2>
              <p>The topic of the application is about an online, multi-player quiz game. A registered user can either play alone or online.</p>
              <p>In addition to exam requirements, I added features such as:</p>
              <ul>
                <li>Admin quiz administration page<ul>
                  <li>Administrators have the possibility to add new quizzes or update existing ones</li>
                </ul>
                </li>
                <li>Single player quiz match</li>
                <li>High score board for online matches</li>
                <li>Chat for online matches</li>
              </ul>
              <h3 id="online-match">Online match</h3>
              <p>If X wishes to play online, X can initialise a new match and wait for other players to join. </p>
              <p>Once there are enough other players (at least 1), X will be able to start the match. </p>
              <p>Each time when a new player enters the initialised match, other players will be notified.</p>
              <p>Each match consists of 10 rounds, where players get points based on correct answers and how long they take to answer.</p>
              <h4 id="high-score">High score</h4>
              <p>When a player select an answer for a current round, the high score board will be updated and sorted by players score. </p>
              <p>At the end of the 10th round, a player with most points will be declared as the winner.</p>
              <h4 id="chat">Chat</h4>
              <p>When a match is initialised, players will be able to send messages to each other.</p>
              <h3 id="single-player-match">Single player match</h3>
              <p>In order to play, a user has to register first.</p>
              <h3 id="quiz-management-page">Quiz management page</h3>
              <p>Login as admin (<code>username: admin, password: admin</code>) to access quiz management page.</p>
              <p>New quizzes can be added or existing quizzes can be updated from the quiz management page.</p>
              <h2 id="endpoints">Endpoints</h2>
              <table className="table">
                <thead>
                <tr>
                  <th><strong>Path</strong></th>
                  <th><strong>Description</strong></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td><code>POST</code> /login</td>
                  <td>requires userId &amp; password</td>
                </tr>
                <tr>
                  <td><code>POST</code> /signup</td>
                  <td>requires userId &amp; password</td>
                </tr>
                <tr>
                  <td><code>POST</code> /logout</td>
                </tr>
                <tr>
                  <td><code>POST</code> /wstoken</td>
                  <td>returns a random token for current user</td>
                </tr>
                <tr>
                  <td><code>POST</code> /user</td>
                  <td>return current users id</td>
                </tr>
                <tr>
                  <td><code>GET</code> /categories</td>
                  <td>returns all categories</td>
                </tr>
                <tr>
                  <td><code>GET</code> /quizzes</td>
                  <td>returns all quizzes </td>
                </tr>
                <tr>
                  <td><code>GET</code> /randomQuiz</td>
                  <td>returns a random quiz </td>
                </tr>
                <tr>
                  <td><code>POST</code> /quiz</td>
                  <td>requires user to be admin, question, answers, correct answer and category, returns the id of the quiz </td>
                </tr>
                <tr>
                  <td><code>PUT</code> /quiz</td>
                  <td>requires user to be admin, id, question, answers, correct answer and category </td>
                </tr>
                <tr>
                  <td><code>POST</code> /match</td>
                  <td>requires user to be logged in, userId &amp; score, returns id of match </td>
                </tr>
                <tr>
                  <td><code>PUT</code> /match</td>
                  <td>requires user to be logged in, matchId ,userId &amp; score</td>
                </tr>
                <tr>
                  <td><code>POST</code> /matches</td>
                  <td>requires user to be logged in,  player is added to the queue if empty, otherwise match will be initialised with player from the queue / the player will be added to the initialised match</td>
                </tr>
                <tr>
                  <td><code>POST</code> /startmatch</td>
                  <td>requires user to be logged in and to be the first player who initiated the match</td>
                </tr>
                </tbody>
              </table>
              <h2 id="how-to">How to</h2>
              <ol>
                <li><code>npm install</code> to install dependencies</li>
                <li><code>npm start</code> (dev)</li>
                <li><code>npm run test</code> (runs all tests)</li>
                <li><code>npm run jest</code> (measure coverage with Jest)</li>
                <li><code>npm run build</code> (prod)</li>
              </ol>
              <h2 id="technologies-used">Technologies used</h2>
              <table className="table">
                <thead>
                <tr>
                  <th><strong>Dependencies</strong></th>
                  <th><strong>Usage</strong></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>babel-polyfill</td>
                  <td>Polyfill for features that cannot be transpiled</td>
                </tr>
                <tr>
                  <td>enzyme</td>
                  <td>Testing utilities for React</td>
                </tr>
                <tr>
                  <td>eslint</td>
                  <td>JS Linter</td>
                </tr>
                <tr>
                  <td>express</td>
                  <td>Serves development and production builds</td>
                </tr>
                <tr>
                  <td>jest</td>
                  <td>Testing library</td>
                </tr>
                <tr>
                  <td>mocha</td>
                  <td>Testing library</td>
                </tr>
                <tr>
                  <td>react</td>
                  <td>React library </td>
                </tr>
                <tr>
                  <td>react-dom</td>
                  <td>DOM rendering </td>
                </tr>
                <tr>
                  <td>react-redux</td>
                  <td>Connecting React components to Redux </td>
                </tr>
                <tr>
                  <td>react-router</td>
                  <td>Routing </td>
                </tr>
                <tr>
                  <td>react-router-redux</td>
                  <td>Keep React Router in sync with Redux</td>
                </tr>
                <tr>
                  <td>redux</td>
                  <td>Redux library </td>
                </tr>
                <tr>
                  <td>redux-thunk</td>
                  <td>Async redux library</td>
                </tr>
                <tr>
                  <td>socket.io</td>
                  <td>Real-time bidirectional event-based communication</td>
                </tr>
                <tr>
                  <td>webpack</td>
                  <td>Bundler with plugin system and integrated dev server</td>
                </tr>
                <tr>
                  <td>webpack-dev-middleware </td>
                  <td>Webpack middleware support </td>
                </tr>
                <tr>
                  <td>webpack-hot-middleware </td>
                  <td>Webpack hot reloading </td>
                </tr>
                </tbody>
              </table>
              <p>These are some of the main dependencies used for this project, in addition to some other useful libraries.</p>
              <h3 id="boilerplate">Boilerplate</h3>
              <p>Boilerplate for React + Redux, with Babel, hot reloading and linting adapted from: <a href="https://github.com/coryhouse/pluralsight-redux-starter">https://github.com/coryhouse/pluralsight-redux-starter</a>.</p>
              <h3 id="code-provided-in-class">Code provided in class</h3>
              <p>Some of the code was adapted from the main repository of the PG6300 course: <a href="https://github.com/arcuri82/pg6300">https://github.com/arcuri82/pg6300</a>.
                Refer to the comments in the code stating which code has been adapted from the course.</p>
              <h3 id="challenges">Challenges</h3>
              <p>I experienced some weird behaviour when running tests, they would randomly fail
                with a timeout error. This occurred only on a certain machine. I tried to reproduce the error
                on other machines and Jenkins but to no avail. An ugly way of solving this issue is to either add
                a --timeout flag in the test script or to manually add timeout to functions to increase the default timeout of Mocha.</p>
              <h3 id="improvements">Improvements</h3>
              <ul>
                <li>Add more tests</li>
                <li>Implement redux socket middleware</li>
              </ul>

            </div>
        );
    }
}

export default AboutPage;
