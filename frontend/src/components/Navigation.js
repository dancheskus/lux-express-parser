import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

const Navigation = props => {
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <b>{props.user.isLoggedIn.toString()}</b>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Navigation);
