import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { addUser } from '../../actions/userActions';
import { VH100on, VH100off } from '../../actions/styleActions';

import { NavLink, withRouter } from 'react-router-dom';

import { FormGroup, Input, Col, Container, Row } from 'reactstrap';

import { Background, StyledForm, StyledAlert } from './style';

class LoginRegisterPage extends Component {
  state = {
    email: '',
    password: '',
    notification: null,
  };

  componentDidMount = () => this.props.VH100on();

  componentWillUnmount = () => this.props.VH100off();

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  loginPressed = async e => {
    e.preventDefault();
    const { email, password } = this.state;

    if (!(email && password)) return this.setState({ notification: { message: 'Заполните все поля', type: 'danger' } });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        email,
        password,
      })
      .then(({ data: { user, token } }) => {
        this.props.addUser(user);
        localStorage.setItem('token', token);
        this.props.history.push('/');
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
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
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
                  </div>

                  <button onClick={this.loginPressed} className="btn btn-block main-button text-white">
                    Войти
                  </button>

                  <NavLink className="btn btn-block second-button bg-white" to="/register">
                    Регистрация
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
  addUser: user => dispatch(addUser(user)),
  VH100on: () => dispatch(VH100on()),
  VH100off: () => dispatch(VH100off()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginRegisterPage)
);
