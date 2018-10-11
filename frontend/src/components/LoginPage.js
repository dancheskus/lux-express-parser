import React, { Component } from 'react';
import axios from 'axios';

export default class LoginPage extends Component {
  state = {
    username: '',
    password: '',
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  loginPressed = e => {
    e.preventDefault();
    console.log(typeof this.state.username, typeof this.state.password);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        username: this.state.username,
        password: this.state.password,
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
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
