import { createStore, combineReducers } from 'redux';

import ticketsReducer from '../reducers/ticketReducer';
import userReducer from '../reducers/userReducer';

export default () => {
  const store = createStore(combineReducers({ tickets: ticketsReducer, user: userReducer }));
  return store;
};
