import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addUser } from '../actions/userActions';
import { withRouter } from 'react-router';

class RegisterPage extends Component {
  state = {
    username: '',
    email: '',
    password: '',
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  registerPressed = e => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      })
      .then(({ data }) => {
        console.log(data.message);
        this.props.history.push('/login');
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
          <label>Email</label>
          <input type="email" name="email" required value={this.state.email} onChange={this.handleChange} />
          <label>Password</label>
          <input type="password" name="password" required value={this.state.password} onChange={this.handleChange} />
          <button onClick={this.registerPressed}>Register</button>
        </form>
      </div>
    );
  }
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
  )(RegisterPage)
);
