import React from 'react';

class AboutPage extends React.Component {
    render() {
        return (
            <div className="container">
              <h1 id="pg6300-quiz-exam">PG6300 Quiz exam</h1>
              <h3 id="travis">Travis</h3>
              <h2><a href="https://travis-ci.com/stellaselena/pg6300-quiz-exam">
                <embed
                  src="https://travis-ci.com/stellaselena/pg6300-quiz-exam.svg?token=xqfmXCaJoqxaqpsVZGP3&amp;branch=master"/>
              </a></h2>
              <h3 id="heroku">Heroku</h3>
              <p><a href="https://stella-quiz-app.herokuapp.com">Link to heroku app</a></p>
              <h3 id="repository">Repository</h3>
              <p><a href="https://github.com/stellaselena/PG6300-quiz-exam">Link to repository</a></p>
              <h2 id="about-the-application">About the application:</h2>
              <p>The topic of the application is about an online, multi-player quiz game. A registered user can either
                play alone or online.</p>
              <h5 id="online-match">Online match</h5>
              <p>If X wishes to play online, X can initialise a new match and wait for other players to join.</p>
              <p>Once there are enough other players (at least 1), X will be able to start a match.</p>
              <p>Each match consists of 10 rounds, where players get points based on correct answers and how long they
                take to answer.</p>
              <p>At the end of the 10th round, a player with most points will be declared as the winner.</p>
              <h5 id="singleplayer-match">Singleplayer match</h5>
              <p>In order to play, a user has to register first.</p>
              <h5 id="quiz-management-page">Quiz management page</h5>
              <p>Login as admin (<code>username: admin, password: admin</code>) to access quiz management page.</p>
              <p>New quizzes can be added or existing quizzes can be updated from the quiz management page.</p>
              <h2 id="how-to">How to</h2>
              <ol>
                <li><code>npm install</code> (dependency installation depends on internet speed &amp; hardware, in my
                  case it takes around 1 minute)
                </li>
                <li><code>npm start</code></li>
                <li><code>npm run test</code> (runs all tests)</li>
                <li><code>npm run jest</code> (measure coverage with Jest)</li>
              </ol>
              <h3 id="technologies-used">Technologies used</h3>
              <table>
                <thead>
                <tr className="header">
                  <th align="left"><strong>Dependencies</strong></th>
                  <th align="left"><strong>Usage</strong></th>
                </tr>
                </thead>
                <tbody>
                <tr className="odd">
                  <td align="left">babel-polyfill</td>
                  <td align="left">Polyfill for features that cannot be transpiled</td>
                </tr>
                <tr className="even">
                  <td align="left">enzyme</td>
                  <td align="left">Testing utilities for React</td>
                </tr>
                <tr className="odd">
                  <td align="left">eslint</td>
                  <td align="left">JS Linter</td>
                </tr>
                <tr className="even">
                  <td align="left">express</td>
                  <td align="left">Serves development and production builds</td>
                </tr>
                <tr className="odd">
                  <td align="left">jest</td>
                  <td align="left">Testing library</td>
                </tr>
                <tr className="even">
                  <td align="left">mocha</td>
                  <td align="left">Testing library</td>
                </tr>
                <tr className="odd">
                  <td align="left">react</td>
                  <td align="left">React library</td>
                </tr>
                <tr className="even">
                  <td align="left">react-dom</td>
                  <td align="left">DOM rendering</td>
                </tr>
                <tr className="odd">
                  <td align="left">react-redux</td>
                  <td align="left">Connecting React components to Redux</td>
                </tr>
                <tr className="even">
                  <td align="left">react-router</td>
                  <td align="left">Routing</td>
                </tr>
                <tr className="odd">
                  <td align="left">react-router-redux</td>
                  <td align="left">Keep React Router in sync with Redux</td>
                </tr>
                <tr className="even">
                  <td align="left">redux</td>
                  <td align="left">Redux library</td>
                </tr>
                <tr className="odd">
                  <td align="left">redux-thunk</td>
                  <td align="left">Async redux library</td>
                </tr>
                <tr className="even">
                  <td align="left">socket.io</td>
                  <td align="left">Real-time bidirectional event-based communication</td>
                </tr>
                <tr className="odd">
                  <td align="left">webpack</td>
                  <td align="left">Bundler with plugin system and integrated dev server</td>
                </tr>
                <tr className="even">
                  <td align="left">webpack-dev-middleware</td>
                  <td align="left">Webpack middleware support</td>
                </tr>
                <tr className="odd">
                  <td align="left">webpack-hot-middleware</td>
                  <td align="left">webpack hot reloading</td>
                </tr>
                </tbody>
              </table>
              <p>These are some of the main dependencies used for this project, in addition to some other useful
                libraries.</p>
              <h4 id="boilerplate">Boilerplate</h4>
              <p>Boilerplate for React + Redux, with Babel, hot reloading and linting adapted from
                https://github.com/coryhouse/pluralsight-redux-starter.</p>
              <h4 id="code-provided-in-class">Code provided in class</h4>
              <p>Some of the code was adapted from the main repository of the PG6300 course:
                https://github.com/arcuri82/pg6300. Refer to the comments in the code stating which code has been
                adapted from the course.</p>
              <h4 id="challenges">Challenges</h4>
              <p>I experienced some weird behaviour when running tests, they would randomly fail with a timeout error.
                This occurred only on certain machines. I tried to reproduce the error on other machines and Jenkins but
                to no avail. An ugly way of solving this issue is to either add a --timeout flag in the test script or
                to manually add timeout to functions and increase the default timeout of Mocha.</p>

            </div>
        );
    }
}

export default AboutPage;
