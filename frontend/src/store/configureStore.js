import { createStore, combineReducers } from 'redux';

import ticketsReducer from '../reducers/ticketReducer';
import userReducer from '../reducers/userReducer';
// import { verifyToken } from '../authHelper';

export default () => {
  const store = createStore(
    combineReducers({ tickets: ticketsReducer, user: userReducer }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  // verifyToken(localStorage.getItem('token'), store.dispatch);

  return store;
};
