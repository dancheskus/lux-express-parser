const token = localStorage.getItem('token');
if (!token) return;
verifyToken(token, props.dispatch);

const userReducer = (state = { isLoggedIn: false }, action) => {
  const allTypes = {
    LOG_IN: () => ({ isLoggedIn: true }),
    LOG_OUT: () => ({ isLoggedIn: false }),
    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default userReducer;
