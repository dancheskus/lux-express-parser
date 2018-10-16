import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOutUser } from '../actions/userActions';

const Navigation = props => {
  return (
    <div>
      <NavLink to="/">Home</NavLink>

      {!props.user.isLoggedIn ? (
        <Fragment>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </Fragment>
      ) : null}

      {props.user.isLoggedIn ? (
        <NavLink to="#">
          <div onClick={() => props.logOutUser()}>Log Out</div>
        </NavLink>
      ) : null}
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  logOutUser: () => dispatch(logOutUser()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
