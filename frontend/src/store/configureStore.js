import { createStore, combineReducers } from 'redux';
import axios from 'axios';

import ticketsReducer from '../reducers/ticketReducer';
import userReducer from '../reducers/userReducer';
import { verifyToken } from '../authHelper';
import { serverStoppedThinking } from '../actions/userActions';

export default () => {
  const store = createStore(combineReducers({ tickets: ticketsReducer, user: userReducer }));
  const token = localStorage.getItem('token');

  if (!token) {
    store.dispatch(serverStoppedThinking());
    return store;
  }

  axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/findbytoken`, {
      headers: { 'x-auth': localStorage.getItem('token') },
    })
    .then(({ data: { email, username, _id } }) => {
      console.log('----RECEIVED-----', email, username, _id);
      verifyToken(
        {
          token,
          user: {
            email: 'test@email.com',
            username: 'testuser',
            _id: '123123',
          },
        },
        store.dispatch
      );
      store.dispatch(serverStoppedThinking());
    });

  return store;
};
