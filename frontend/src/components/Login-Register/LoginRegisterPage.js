import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { addUser, removeUser } from '../../actions/userActions';
import { VH100on, VH100off } from '../../actions/styleActions';

import { NavLink, withRouter } from 'react-router-dom';

import { FormGroup, Input, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';

import { Background, StyledForm, StyledAlert, RegisterErrorTooltipStyle } from './style';

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
        });
      })
      .catch(({ response }) => {
        console.log(response.data.message);
      });
  };

  render() {
    // eslint-disable-next-line
    const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    return (
      <Background className="d-flex flex-column flex-grow-1">
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
              <StyledAlert
                isOpen={!!this.state.notification}
                toggle={() => this.setState({ notification: null })}
                color={this.state.notification && this.state.notification.type}
              >
                {this.state.notification && this.state.notification.message}
              </StyledAlert>

              {/* <StyledAlert isOpen={true} toggle={() => this.setState({ notification: null })} color="danger">
                this is my message
              </StyledAlert> */}

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

        {/* <div>
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
        </div> */}

        <div className="d-flex flex-grow-1">
          <Container className="d-flex flex-column justify-content-center">
            <Row>
              <Col md={{ size: 4, offset: 4 }}>
                <StyledForm>
                  <div className="bg-white rounded">
                    <FormGroup>
                      <Input
                        name="username"
                        placeholder="Имя пользователя"
                        value={this.state.username}
                        onChange={this.handleChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <RegisterErrorTooltipStyle id="email-error" visible={true} />
                      <UncontrolledTooltip placement="right" target="email-error">
                        Неверный формат email
                      </UncontrolledTooltip>

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
                      <RegisterErrorTooltipStyle id="password1-error" visible={true} />
                      <UncontrolledTooltip placement="right" target="password1-error">
                        Пароль недостаточно недежный
                      </UncontrolledTooltip>

                      <Input
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        value={this.state.password}
                        onChange={this.handleChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <RegisterErrorTooltipStyle id="password2-error" visible={true} />
                      <UncontrolledTooltip placement="right" target="password2-error">
                        Пароли не совпадают
                      </UncontrolledTooltip>

                      <Input
                        name="passwordRepeat"
                        type="password"
                        placeholder="Повторите пароль"
                        value={this.state.passwordRepeat}
                        onChange={this.handleChange}
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
