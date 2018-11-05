import React from 'react';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {
    render() {
        return (
            <div className="jumbotron container">
                <h1>Find ongoing matches</h1>
                <p>Play quizzes with other players!</p>
                <Link to="about" className="btn btn-primary btn-lg">Lets go</Link>
            </div>
        );
    }
}

export default HomePage;
