import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const Navigation = props => {
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/register">Register</NavLink>
      <NavLink to="/login">Login</NavLink>
      <b>{props.user.isLoggedIn.toString()}</b>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Navigation);
