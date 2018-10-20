import { verifyToken } from '../authHelper';

const isLoggedIn = verifyToken(localStorage.getItem('token'));

const userReducer = (state = { isLoggedIn: true }, action) => {
  const allTypes = {
    LOG_IN: () => ({ isLoggedIn: true }),
    LOG_OUT: () => {
      localStorage.removeItem('token');
      return { isLoggedIn: false };
    },
    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default userReducer;
