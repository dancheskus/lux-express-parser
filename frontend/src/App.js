import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MainSearchEngine from './components/MainSearchEngine';
import TicketPage from './components/TicketPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LoginRegisterPage from './components/LoginRegisterPage';
import PageNotFound from './components/PageNotFound';
import Navigation from './components/Navigation';
import HOCCheckout from './components/CheckoutForm/index';
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
            <Route path="/logreg" component={LoginRegisterPage} exact />
            <Route
              path="/results"
              render={() => (this.props.tickets.length ? <TicketPage /> : <Redirect to="/" />)}
              exact
            />

            <AuthenticatedComponent path="/" component={MainSearchEngine} exact />
            <AuthenticatedComponent path="/checkout" component={HOCCheckout} exact />

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
