import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MainSearchEngine from './components/MainSearchEngine';
import TicketPage from './components/TicketPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PageNotFound from './components/PageNotFound';
import Navigation from './components/Navigation';
import Home from './components/Home';
import AuthenticatedComponent from './components/AuthenticatedComponent';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <Route path="/login" component={LoginPage} exact />
            <Route path="/register" component={RegisterPage} exact />
            <Route
              path="/results"
              render={() => (this.props.tickets.length ? <TicketPage /> : <Redirect to="/" />)}
              exact
            />

            <AuthenticatedComponent>
              <Route path="/" component={MainSearchEngine} exact />
              <Route path="/home" component={Home} exact />
            </AuthenticatedComponent>
          </Switch>
          <Route path="/404" component={PageNotFound} exact />
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
