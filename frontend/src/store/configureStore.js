import { createStore } from 'redux';

import ticketsReducer from '../reducers/ticketReducer';

export default () => {
  const store = createStore(ticketsReducer);
  return store;
};
