const styleReducer = (state = { VH100: false }, action) => {
  const allTypes = {
    VH100_ON: () => ({ VH100: true }),
    VH100_OFF: () => ({ VH100: false }),
    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default styleReducer;
