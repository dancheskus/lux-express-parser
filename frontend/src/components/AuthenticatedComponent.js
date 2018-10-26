import React, { Component } from 'react';
import { getJwt } from '../helpers/jwt';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { addUser } from '../actions/userActions';

class AuthenticatedComponent extends Component {
  componentDidMount() {
    const jwt = getJwt();
    if (!jwt) {
      this.props.history.push('/login');
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/getUser`, { headers: { 'x-auth': jwt } })
      .then(res => {
        this.props.addUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
      });
  }

  render = () => Object.keys(this.props.user).length > 0 && <this.props.component />;
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  addUser: user => dispatch(addUser(user)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthenticatedComponent)
);
