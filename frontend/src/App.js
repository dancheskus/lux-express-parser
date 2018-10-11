import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import MainSearchEngine from './components/MainSearchEngine';
import TicketPage from './components/TicketPage';
import LoginPage from './components/LoginPage';
import PageNotFound from './components/PageNotFound';
import Navigation from './components/Navigation';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <Route path="/" component={MainSearchEngine} exact />

            <Route
              path="/results"
              render={() => (this.props.tickets.length ? <TicketPage /> : <Redirect to="/login" />)}
            />
            <Route path="/login" component={LoginPage} exact />

            <Route component={PageNotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({ tickets: state.tickets });

export default connect(mapStateToProps)(App);
