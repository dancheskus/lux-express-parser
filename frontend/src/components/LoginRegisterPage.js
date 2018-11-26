import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { addUser, removeUser } from '../actions/userActions';
import { VH100on, VH100off } from '../actions/styleActions';

import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import { Form, FormGroup, Input, Col, Container, Row, Alert } from 'reactstrap';
import styled from 'styled-components';

import BGimage from '../img/background-login.jpg';

const StyledContainer = styled(Container)`
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
`;

const Background = styled.div`
  background: url(${BGimage}) center no-repeat;
  height: 100%;
  background-size: cover;
`;

const FlexCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 80%;
`;

const StyledForm = styled(Form)`
  .bg-white {
    border-radius: 10px;
  }

  .form-group {
    margin: 0;

    input {
      padding: 25px;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #ced4da;

      &.is-valid {
        background: rgba(101, 219, 101, 0.24);
        /* border: 1px solid rgba(101, 219, 101, 0.24); */
      }

      &.is-invalid {
        background: rgba(248, 122, 122, 0.24);
        /* border: 1px solid red; */
      }
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
    border-radius: 7px;

    &:hover {
      transform: translateY(-2px);
    }

    &.main-button {
      background: rgb(72, 172, 152);
      color: #fff;

      &:hover {
        background: rgb(72, 172, 152);
      }

      &:active {
        background-color: rgb(72, 172, 152);
        border-color: rgb(72, 172, 152);
      }
    }

    &.second-button {
      margin-top: 20px;
      background: #fff;
      color: rgb(72, 172, 152);

      &:hover {
        background: #fff;
      }
    }
  }
`;

class LoginRegisterPage extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    notification: null,
  };

  componentDidMount() {
    this.props.VH100on();
  }

  componentWillUnmount() {
    this.props.VH100off();
  }

  resetAlerts = () =>
    this.setState({
      passwordNoMatchAlert: false,
      emailNotCorrectAlert: false,
      nameAlreadyExistsAlert: false,
      emailAlreadyExistsAlert: false,
      emptyFieldsAlert: false,
      successAlert: false,
    });
  closeSuccessAlert = () => this.setState({ successAlert: false });
  closePasswordNoMatchAlert = () => this.setState({ passwordNoMatchAlert: false });
  closeEmailNotCorrectAlert = () => this.setState({ emailNotCorrectAlert: false });

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  registerPressed = e => {
    e.preventDefault();

    if (!this.state.username || !this.state.email || !this.state.password || !this.state.passwordRepeat)
      return console.log('Не все поля заполнены');

    if (this.state.password !== this.state.passwordRepeat) return console.log('Пароли не совпадают');

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

    return (
      <Background>
        {/*       passwordNoMatch: false,
      emailNotCorrect: false,
      nameAlreadyExists: false,
      emailAlreadyExists: false,
      success: false, */}

        {/* СООБЩЕНИЯ */}
        <Container>
          <Row>
            <Col className="text-center" md={{ size: 6, offset: 3 }}>
              {/* --------------имя */}
              {/* --------------email */}
              <Alert
                isOpen={!!this.state.notification}
                toggle={() => this.setState({ notification: null })}
                color={this.state.notification && this.state.notification.type}
              >
                {this.state.notification && this.state.notification.message}
              </Alert>

              {/* <Alert isOpen={this.state.emailNotCorrectAlert} toggle={this.closeEmailNotCorrectAlert} color="danger">
                Email введен некорректно.
              </Alert> */}
              {/* --------------успех */}
              {/* <Alert isOpen={this.state.successAlert} toggle={this.closeSuccessAlert} color="success">
                Вы успешно зарегестрированы.{' '}
                <NavLink className="alert-link" to="/login">
                  Войдите
                </NavLink>{' '}
                в свою учетную запись.
              </Alert> */}

              {/* --------------пароль */}
              {/* <Alert isOpen={this.state.passwordNoMatchAlert} toggle={this.closePasswordNoMatchAlert} color="danger">
                Пароли не совпали. Повторите попытку.
              </Alert> */}
            </Col>
          </Row>
        </Container>
        <button
          onClick={() =>
            this.setState({
              notification: {
                message: (
                  <Fragment>
                    Вы успешно зарегестрированы.{' '}
                    <NavLink className="alert-link" to="/login">
                      Войдите
                    </NavLink>{' '}
                    в свою учетную запись.
                  </Fragment>
                ),
                type: 'success',
              },
            })
          }
        >
          TEST
        </button>
        <FlexCenter>
          <StyledContainer>
            <Row>
              <Col md={{ size: 4, offset: 4 }}>
                <StyledForm>
                  <div className="bg-white">
                    <FormGroup>
                      <Input
                        name="username"
                        placeholder="Имя пользователя"
                        value={this.state.username}
                        onChange={this.handleChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        valid={!!this.state.email.match(emailRegex)}
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        onBlur={e => {
                          this.resetAlerts();
                          return !!this.state.email.match(emailRegex)
                            ? (e.target.classList.add('is-valid'), e.target.classList.remove('is-invalid'))
                            : (e.target.classList.remove('is-valid'),
                              e.target.classList.add('is-invalid'),
                              this.setState({ emailNotCorrectAlert: true }));
                        }}
                      />
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
                  </div>

                  <button onClick={this.registerPressed} className="btn btn-block main-button">
                    Регистрироваться
                  </button>

                  <button className="btn btn-block second-button">Уже есть аккаунт?</button>
                </StyledForm>
              </Col>
            </Row>
          </StyledContainer>
        </FlexCenter>
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
  VH100on: () => dispatch(VH100on()),
  VH100off: () => dispatch(VH100off()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginRegisterPage)
);
