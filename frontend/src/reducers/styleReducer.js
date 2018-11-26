const styleReducer = (state = { VH100: false }, action) => {
  const allTypes = {
    TOGGLE_VH100: () => ({ VH100: !state.VH100 }),
    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default styleReducer;
