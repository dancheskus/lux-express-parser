import jwtDecode from 'jwt-decode';
import { logInUser, logOutUser } from './actions/userActions';

export const verifyToken = (token, dispatch) => {
  if (!token) return false;
  const exp = jwtDecode(token).exp * 1000 - Date.now();
  if (exp <= 0) return false;
  if (dispatch) {
    dispatch(logInUser());

    setTimeout(() => {
      dispatch(logOutUser());
      localStorage.removeItem('token');
    }, exp);
  }
  return true;
};
