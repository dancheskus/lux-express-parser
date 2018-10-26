const userReducer = (state = {}, action) => {
  const allTypes = {
    ADD_USER: () => action.user,
    REMOVE_USER: () => {
      localStorage.removeItem('token');
      return {};
    },
    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default userReducer;
