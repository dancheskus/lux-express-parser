import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import MainSearchEngine from './components/MainSearchEngine';
import TicketPage from './components/TicketPage';
import LoginPage from './components/Login-Register/LoginPage';
import RegisterPage from './components/Login-Register/RegisterPage';
import PageNotFound from './components/PageNotFound';
import Navigation from './components/Navigation';
import HOCCheckout from './components/CheckoutForm/index';

import AuthenticatedComponent from './components/AuthenticatedComponent';

import { connect } from 'react-redux';
import styled from 'styled-components';

const VH100 = styled.div`
  ${props => (props.vh100 ? `height: 100vh; display: flex; flex-direction: column;` : ``)}
`;

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <VH100 vh100={this.props.style}>
          <Navigation />
          <Switch>
            <Route path="/login" component={LoginPage} exact />
            <Route path="/register" component={RegisterPage} exact />
            <Route
              path="/results"
              render={() => (this.props.tickets.length ? <TicketPage /> : <Redirect to="/" />)}
              exact
            />

            <AuthenticatedComponent path="/" component={MainSearchEngine} exact />
            <AuthenticatedComponent path="/checkout" component={HOCCheckout} exact />

            <Route component={PageNotFound} />
          </Switch>
        </VH100>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({ tickets: state.tickets, user: state.user, style: state.style.VH100 });

export default connect(mapStateToProps)(App);
