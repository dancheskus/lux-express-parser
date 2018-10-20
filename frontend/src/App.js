import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MainSearchEngine from './components/MainSearchEngine';
import TicketPage from './components/TicketPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PageNotFound from './components/PageNotFound';
import Navigation from './components/Navigation';
import { connect } from 'react-redux';
import { PrivateRoute } from './PrivateRoute';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <PrivateRoute path="/" component={MainSearchEngine} exact />

            <Route
              path="/register"
              render={() => (!this.props.user.isLoggedIn ? <RegisterPage /> : <Redirect to="/search" />)}
              exact
            />

            <Route
              path="/results"
              render={() => (this.props.tickets.length ? <TicketPage /> : <Redirect to="/" />)}
              exact
            />
            <Route path="/login" component={LoginPage} exact />

            <Route component={PageNotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({ tickets: state.tickets, user: state.user });

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(App);
