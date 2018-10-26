import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeUser } from '../actions/userActions';

const Navigation = props => {
  const isLoggedIn = Object.keys(props.user).length === 0;
  return (
    <div>
      <ul className="navbar">
        <img src="https://luxexpress.eu/sites/all/themes/lux/logo.png" className="logo" alt="logo" />
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
    </div>
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
