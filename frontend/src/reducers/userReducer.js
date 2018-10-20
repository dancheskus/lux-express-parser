const userReducer = (state = { isLoggedIn: false }, action) => {
  const allTypes = {
    // LOG_IN: () => ({ isLoggedIn: true }),
    // LOG_OUT: () => {
    //   localStorage.removeItem('token');
    //   return { isLoggedIn: false };
    // },
    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default userReducer;
