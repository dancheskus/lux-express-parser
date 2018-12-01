import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { VH100on, VH100off } from '../../actions/styleActions';

import { NavLink, withRouter } from 'react-router-dom';

import { FormGroup, Input, Col, Container, Row } from 'reactstrap';

import { Background, StyledForm, StyledAlert } from './style';

import ErrorTooltip from './ErrorTooltip';

class LoginRegisterPage extends Component {
  initialState = {
    name: '',
    surname: '',
    email: '',
    password: '',
    passwordRepeat: '',
    notification: null,
    nameInputError: null,
    surInputError: null,
    emailInputError: null,
    password1InputError: null,
    password2InputError: null,
  };

  state = this.initialState;

  componentDidMount() {
    this.props.VH100on();
  }

  componentWillUnmount() {
    this.props.VH100off();
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  registerPressed = e => {
    e.preventDefault();

    if (
      !this.state.name ||
      !this.state.surname ||
      !this.state.email ||
      !this.state.password ||
      !this.state.passwordRepeat
    )
      return this.setState({ notification: { message: 'Заполните все поля', type: 'danger' } });

    if (this.state.password !== this.state.passwordRepeat)
      return this.setState({ password2InputError: 'Пароли не совпадают' });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
        name: this.state.name,
        surname: this.state.surname,
        email: this.state.email,
        password: this.state.password,
      })
      .then(({ data }) => {
        this.setState({
          ...this.initialState,
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
        });
      })
      .catch(({ response }) => {
        this.setState({
          notification: {
            message: response.data.message,
            type: 'danger',
          },
        });
      });
  };

  render() {
    // eslint-disable-next-line
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return (
      <Background className="d-flex flex-column flex-grow-1">
        <Container>
          <Row>
            <Col className="text-center" md={{ size: 6, offset: 3 }}>
              <StyledAlert
                isOpen={!!this.state.notification}
                toggle={() => this.setState({ notification: null })}
                color={this.state.notification && this.state.notification.type}
              >
                {this.state.notification && this.state.notification.message}
              </StyledAlert>
            </Col>
          </Row>
        </Container>

        <div className="d-flex flex-grow-1">
          <Container className="d-flex flex-column justify-content-center">
            <Row>
              <Col md={{ size: 4, offset: 4 }}>
                <StyledForm>
                  <div className="bg-white rounded">
                    <FormGroup>
                      <ErrorTooltip content={this.state.nameInputError} />

                      <Input name="name" placeholder="Имя*" value={this.state.name} onChange={this.handleChange} />
                    </FormGroup>

                    <FormGroup>
                      <ErrorTooltip content={this.state.surnameInputError} />

                      <Input
                        name="surname"
                        placeholder="Фамилия*"
                        value={this.state.surname}
                        onChange={this.handleChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <ErrorTooltip content={this.state.emailInputError} />

                      <Input
                        name="email"
                        type="email"
                        placeholder="Email*"
                        value={this.state.email}
                        onChange={this.handleChange}
                        onBlur={() => {
                          if (this.state.email.length >= 1 && !this.state.email.match(emailRegex))
                            return this.setState({
                              emailInputError: 'Неверный формат email',
                            });

                          axios
                            .post(`${process.env.REACT_APP_BACKEND_URL}/checkEmail`, {
                              email: this.state.email,
                            })
                            .then(({ data }) => {
                              this.setState({
                                emailInputError: data.emailAlreadyRegistered === true ? 'Этот email уже занят' : null,
                              });
                            })
                            .catch(({ response }) => {
                              console.log(response);
                            });
                        }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <ErrorTooltip content={this.state.password1InputError} />

                      <Input
                        name="password"
                        type="password"
                        placeholder="Пароль*"
                        value={this.state.password}
                        onChange={this.handleChange}
                        onBlur={() =>
                          this.setState({
                            password1InputError:
                              this.state.password.length >= 1 && this.state.password.length < 6
                                ? 'Минимальная длинна пароля 6 символов'
                                : null,
                          })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <ErrorTooltip content={this.state.password2InputError} />

                      <Input
                        name="passwordRepeat"
                        type="password"
                        placeholder="Повторите пароль*"
                        value={this.state.passwordRepeat}
                        onChange={this.handleChange}
                        onBlur={() =>
                          this.setState({
                            password2InputError:
                              this.state.password.length >= 1 &&
                              this.state.passwordRepeat.length >= 1 &&
                              this.state.password !== this.state.passwordRepeat
                                ? 'Пароли не совпадают'
                                : null,
                          })
                        }
                      />
                    </FormGroup>
                  </div>

                  <button onClick={this.registerPressed} className="btn btn-block main-button text-white">
                    Регистрироваться
                  </button>

                  <NavLink className="btn btn-block second-button bg-white" to="/login">
                    Уже есть аккаунт?
                  </NavLink>
                </StyledForm>
              </Col>
            </Row>
          </Container>
        </div>
      </Background>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  VH100on: () => dispatch(VH100on()),
  VH100off: () => dispatch(VH100off()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginRegisterPage)
);
