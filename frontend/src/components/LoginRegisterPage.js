import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addUser, removeUser } from '../actions/userActions';
import { withRouter } from 'react-router';
import { Form, FormGroup, Input, FormFeedback, Button, Col, Container, Row } from 'reactstrap';
import styled from 'styled-components';
import BGimage from '../img/background-login.jpg';

class LoginRegisterPage extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

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
    // eslint-disable-next-line
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    const StyledContainer = styled(Container)`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;

    const Background = styled.div`
      background: url(${BGimage}) center no-repeat;
      height: 100vh;
      background-size: cover;
    `;

    const StyledForm = styled(Form)`
      .form-group {
        margin: 0;

        input {
          padding: 25px;
          border: none;
          border-radius: 0;
          border-bottom: 1px solid #ced4da;
        }

        &:first-of-type input {
          border-radius: 10px 10px 0 0;
        }

        &:last-of-type input {
          border-radius: 0 0 10px 10px;
          border-bottom: 0;
        }
      }

      button {
        margin-top: 70px;
        padding: 12.5px;
        border: none;
        transition: transform 0.2s;

        &:hover {
          transform: translateY(-2px);
        }
      }

      .main-button {
        background: rgb(72, 172, 152);

        &:hover {
          background: rgb(72, 172, 152);
        }
      }

      .second-button {
        background: #fff;
        color: rgb(72, 172, 152);

        &:hover {
          background: #fff;
        }
      }
    `;

    return (
      <Background>
        <StyledContainer>
          <Row>
            <Col md={{ size: 4, offset: 4 }}>
              <StyledForm>
                <FormGroup>
                  <Input
                    valid
                    name="username"
                    placeholder="Имя пользователя"
                    value={this.state.username}
                    onChange={this.handleChange}
                  />
                  <FormFeedback tooltip>Имя уже занято</FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <FormFeedback tooltip>Email уже занят</FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Input
                    name="passwordRepeat"
                    type="password"
                    placeholder="Повторите пароль"
                    value={this.state.passwordRepeat}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <Button className="main-button" block>
                  Регистрироваться
                </Button>

                <Button className="second-button" block>
                  Уже есть аккаунт?
                </Button>
              </StyledForm>
            </Col>
          </Row>
        </StyledContainer>
      </Background>
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
  )(LoginRegisterPage)
);
