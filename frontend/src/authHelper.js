import jwtDecode from 'jwt-decode';
import { logInUser, logOutUser } from './actions/userActions';

export const verifyToken = (token, dispatch, history) => {
  const exp = Math.round(jwtDecode(token).exp * 1000 - Date.now());
  if (exp > 0) {
    dispatch(logInUser());
    history.push('/search');
  }
  setTimeout(() => {
    dispatch(logOutUser());
    localStorage.removeItem('token');
  }, exp);
};
