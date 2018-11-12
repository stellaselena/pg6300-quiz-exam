import React from 'react';
import {Link} from 'react-router-dom';

class HomePage extends React.Component {
  render() {
    return (
      <div className="jumbotron container">
        <h1>Find ongoing matches</h1>
        <p><Link to="play_online">Play</Link> quizzes with other players or <Link to="play_singleplayer">play</Link> alone!</p>
      </div>
    );
  }
}

export default HomePage;
