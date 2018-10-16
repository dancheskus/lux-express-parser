import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

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
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Navigation);
