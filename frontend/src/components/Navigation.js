import React, { Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeUser } from '../actions/userActions';

const Navigation = props => {
  return (
    <div>
      <NavLink to="/">Home</NavLink>

      {Object.keys(props.user).length === 0 && (
        <Fragment>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </Fragment>
      )}

      {Object.keys(props.user).length > 0 && (
        <div
          onClick={() => {
            props.removeUser();
            props.history.push('login');
          }}
        >
          Log Out
        </div>
      )}
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
