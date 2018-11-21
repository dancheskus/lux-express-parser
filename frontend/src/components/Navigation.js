import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeUser } from '../actions/userActions';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class Navigation extends Component {
  state = { isOpen: false };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  isLoggedIn = Object.keys(this.props.user).length === 0;

  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <div className="container">
            <NavbarBrand href="#">LuxSearch</NavbarBrand>

            <NavbarToggler onClick={this.toggle} />

            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <span className="nav-link" to="/" onClick={() => console.log(this.isLoggedIn)}>
                    {this.isLoggedIn.toString()}
                  </span>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/">
                    Home
                  </NavLink>
                </NavItem>

                {this.isLoggedIn && (
                  <NavItem>
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </NavItem>
                )}
                {this.isLoggedIn && (
                  <NavItem>
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  </NavItem>
                )}

                {!this.isLoggedIn && (
                  <NavItem>
                    <NavLink
                      className="nav-link"
                      to="#"
                      onClick={() => {
                        this.props.removeUser();
                        this.props.history.push('/login');
                      }}
                    >
                      Log Out
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
            </Collapse>
          </div>
        </Navbar>

        {/* <ul className="navbar1">
          <img src="https://luxexpress.eu/sites/all/themes/lux/logo.png" className="logo" alt="logo" />
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {isLoggedIn && (
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink
                to="#"
                onClick={() => {
                  props.removeUser();
                  props.history.push('/login');
                }}
              >
                Log Out
              </NavLink>
            </li>
          )}
        </ul> */}
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
