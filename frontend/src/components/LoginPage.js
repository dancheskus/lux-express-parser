import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addUser, removeUser } from '../actions/userActions';
import { withRouter } from 'react-router';

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  loginPressed = e => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        username: this.state.username,
        password: this.state.password,
      })
      .then(({ data: { user, token } }) => {
        this.props.addUser(user);
        localStorage.setItem('token', token);
        this.props.history.push('/');
      })
      .catch(({ response }) => {
        console.log(response.data.message);
      });
  };

  render() {
    return (
      <div>
        <form>
          <label>Username</label>
          <input type="text" name="username" required value={this.state.username} onChange={this.handleChange} />
          <label>Password</label>
          <input type="password" name="password" required value={this.state.password} onChange={this.handleChange} />
          <button onClick={this.loginPressed}>Log In</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  addUser: user => dispatch(addUser(user)),
  removeUser: () => dispatch(removeUser()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginPage)
);
