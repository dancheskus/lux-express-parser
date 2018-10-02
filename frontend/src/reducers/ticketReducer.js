const ticketsReducer = (state = [], action) => {
  const allTypes = {
    ADD_LINKS: () => state.concat(action.links),
    REMOVE_LINKS: () => [],
    default: () => state,
  };
  return (allTypes[action.type] || allTypes['default'])();
};

export default ticketsReducer;
