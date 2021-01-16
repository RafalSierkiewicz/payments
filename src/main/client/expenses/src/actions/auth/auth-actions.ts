import { IActionEmpty, IActionTyped, ILogin, IRegister } from 'models';

const logout = (): IActionEmpty => ({
  type: actionTypes.LOGOUT,
});

const login = (payload: ILogin): IActionTyped<ILogin> => ({
  payload,
  type: actionTypes.LOGIN,
});

const register = (payload: IRegister): IActionTyped<IRegister> => ({
  payload,
  type: actionTypes.REGISTER,
});
const actionTypes = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
};

const actions = {
  logout,
  login,
  register,
};

export { actionTypes, actions };
