import { verifyToken } from '../authHelper';

const isLoggedIn = verifyToken({ token: localStorage.getItem('token') });

//TODO: remove email, username, id from the param list
const userReducer = (state = { isLoggedIn, email: '', username: '', id: '', serverStoppedThinking: false }, action) => {
  console.log(action);
  const allTypes = {
    LOG_IN: () => ({
      isLoggedIn: true,
      email: action.payload.user.email,
      username: action.payload.user.username,
      id: action.payload.user._id,
    }),

    LOG_OUT: () => {
      localStorage.removeItem('token');
      return { isLoggedIn: false };
    },

    SERVER_STOPPED_THINKING: () => ({ serverStoppedThinking: true }),

    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default userReducer;
