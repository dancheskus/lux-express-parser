import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeUser } from '../actions/userActions';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem } from 'reactstrap';

class Navigation extends Component {
  state = { isOpen: false };

  NavLink = ({ to, name }) => (
    <NavItem>
      <NavLink className="nav-link" to={to} onClick={() => this.setState({ isOpen: false })}>
        {name}
      </NavLink>
    </NavItem>
  );

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const isLoggedIn = Object.keys(this.props.user).length !== 0;

    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <div className="container">
            <NavLink className="navbar-brand" exact to="/">
              LuxSearch
            </NavLink>

            <NavbarToggler onClick={this.toggle} />

            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink className="nav-link" exact to="/">
                    Домашняя
                  </NavLink>
                </NavItem>

                {!isLoggedIn && (
                  <NavItem>
                    <NavLink className="nav-link" to="/register">
                      Регистрация
                    </NavLink>
                  </NavItem>
                )}

                {!isLoggedIn && (
                  <NavItem>
                    <NavLink className="nav-link" to="/login">
                      Вход
                    </NavLink>
                  </NavItem>
                )}

                {isLoggedIn && (
                  <NavItem>
                    <NavLink
                      className="nav-link"
                      to="#"
                      onClick={() => {
                        this.props.removeUser();
                        this.props.history.push('/login');
                      }}
                    >
                      Выход
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
            </Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  removeUser: () => dispatch(removeUser()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navigation)
);
