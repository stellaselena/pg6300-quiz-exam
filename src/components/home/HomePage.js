import React from 'react';
import {Link} from 'react-router-dom';

class HomePage extends React.Component {
  render() {
    return (
      <div className="jumbotron container">
        <h1>Find ongoing matches</h1>
        <p><Link to="play">Play</Link> quizzes with other players!</p>
        Not registered? <Link to="signup"> Click here</Link>
      </div>
    );
  }
}

export default HomePage;
