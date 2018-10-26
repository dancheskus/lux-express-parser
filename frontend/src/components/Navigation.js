import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeUser } from '../actions/userActions';

const Navigation = props => {
  const isLoggedIn = Object.keys(props.user).length === 0;
  return (
    <ul className="navbar">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to="/register">Register</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink
            to="#"
            onClick={() => {
              props.removeUser();
              props.history.push('/login');
            }}
          >
            Log Out
          </NavLink>
        </li>
      )}
    </ul>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  removeUser: () => dispatch(removeUser()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navigation)
);
