import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    component={props =>
      true ? (
        <Component {...props} />
      ) : (
        <div>
          <h1>Is NOT Logged IN</h1>
        </div>
      )
    }
  />
);
