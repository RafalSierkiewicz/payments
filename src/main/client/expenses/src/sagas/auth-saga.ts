import { IActionTyped } from '../models/common';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, actionTypes } from 'actions';
import axios, { AxiosResponse } from 'axios';
import { ILogin, IRegister } from '../models/auth';
import { push } from 'connected-react-router';
import { JWT_KEY } from '../utils';

function* login(action: IActionTyped<ILogin>) {
  try {
    const token = yield call(loginCall, action.payload);
    localStorage.setItem(JWT_KEY, token);
    yield put(actions.users.loadAllUsersStart());
    yield put(push('/'));
  } catch (error) {
    console.log('Error', error);
  }
}

const loginCall = (loginData: ILogin) =>
  axios.post('/api/users/login', loginData).then((response: AxiosResponse) => response.data);

function* register(action: IActionTyped<IRegister>) {
  try {
    const companyID = yield call(registerCall, action.payload);
    console.log(companyID);
  } catch (error) {
    console.log('Error', error);
  }
}

const registerCall = (registerData: IRegister) =>
  axios.post('/api/users/register', registerData).then((response: AxiosResponse) => response.data);

export const authSaga = [
  takeLatest(actionTypes.auth.LOGIN, (action: IActionTyped<ILogin>) => login(action)),
  takeLatest(actionTypes.auth.REGISTER, (action: IActionTyped<IRegister>) => register(action)),
];
