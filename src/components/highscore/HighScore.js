import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as matchActions from '../../actions/matchActions';

class HighScore extends React.Component {
  constructor(props, context) {
    super(props, context);

  }

  render() {
    debugger;
    const matches = this.props.matchLog;
    if (this.props.matchLog.length > 0) {
      return (
        <div className="container">
          <h1 className="text-center">High Score Board</h1>
          <table className="table">
            <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
            </tr>
            </thead>
            <tbody>
            {matches.map((match, i) =>
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{match.userId}</td>
                <td>{match.score}</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      );

    } else {
      return (
        <div className="container">
          <h1 className="text-center">High Score Board</h1>
          <p>No matches available</p>
        </div>
      );

    }

  }
}

HighScore.propTypes = {
  matchLog: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  debugger;
  return {
    matchLog: state.match.matchLog,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(matchActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HighScore));

