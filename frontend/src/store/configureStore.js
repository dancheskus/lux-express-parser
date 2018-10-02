import { createStore, combineReducers } from 'redux';

import ticketsReducer from '../reducers/ticketReducer';

export default () => {
  const store = createStore(combineReducers({ tickets: ticketsReducer }));
  return store;
};
