import React, { Component } from 'react';
import { getJwt } from '../helpers/jwt';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class AuthenticatedComponent extends Component {
  state = {
    user: undefined,
  };

  componentDidMount() {
    const jwt = getJwt();
    if (!jwt) {
      this.props.history.push('/login');
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/getUser`, { headers: { 'x-auth': jwt } })
      .then(res => {
        this.setState({ user: res.data });
      })
      .catch(() => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
      });
  }

  render() {
    if (this.state.user === undefined)
      return (
        <div>
          <h1>LOADING...</h1>
        </div>
      );
    return <div>{this.props.children}</div>;
  }
}

export default withRouter(AuthenticatedComponent);
