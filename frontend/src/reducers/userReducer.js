import { verifyToken } from '../authHelper';

const isLoggedIn = verifyToken(localStorage.getItem('token'));

const userReducer = (state = { isLoggedIn }, action) => {
  const allTypes = {
    LOG_IN: () => ({ isLoggedIn: true }),
    LOG_OUT: () => ({ isLoggedIn: false }),
    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default userReducer;
