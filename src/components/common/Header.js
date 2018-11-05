import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';

const Header = ({loading, userId, logout}) => {
  const activeStyle = { color: 'blue' };
  if(userId !== null && userId !== undefined && userId.length >= 1){
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink to="/"><h2>Quiz game </h2></NavLink>
        <NavLink to="/" activeStyle={activeStyle} exact>Home</NavLink>
        {" | "}
        {userId === "admin" ? <NavLink to="/quizzes" activeStyle={activeStyle}>Quizzes</NavLink> :  <NavLink to="/play" activeStyle={activeStyle}>Play</NavLink> }
        {" | "}
        <NavLink to="/about" activeStyle={activeStyle}>About</NavLink>
        {" | "}
        <NavLink to="/profile" activeStyle={activeStyle}>Logged in as {userId}</NavLink>
        {" | "}
        <NavLink to="" onClick={logout} activeStyle={activeStyle}>Logout</NavLink>
      </nav>
    );
  } else {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink to="/"><h2>Quiz game </h2></NavLink>
        <NavLink to="/" activeStyle={activeStyle} exact>Home</NavLink>
        {" | "}
        <NavLink to="/about" activeStyle={activeStyle}>About</NavLink>
        {" | "}
        <NavLink to="/signup" activeStyle={activeStyle}>Sign up</NavLink>
        {" | "}
        <NavLink to="/login" activeStyle={activeStyle}>Login</NavLink>
      </nav>
    );
  }
  
 
};

Header.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string
};

export default Header;
