import jwtDecode from 'jwt-decode';
import { logInUser, logOutUser } from './actions/userActions';

export const verifyToken = (data, dispatch) => {
  if (!data.token) return false;
  const { exp } = jwtDecode(data.token);
  if (!exp) {
    if (dispatch) dispatch(logInUser(data));

    return true;
  }
  const timeLeft = exp * 1000 - Date.now();
  if (timeLeft <= 0) return false;
  if (dispatch) {
    dispatch(logInUser());

    setTimeout(() => {
      dispatch(logOutUser());
      localStorage.removeItem('token');
    }, timeLeft);
  }
  return true;
};
