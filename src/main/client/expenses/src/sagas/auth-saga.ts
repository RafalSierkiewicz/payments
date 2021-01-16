import { IActionEmpty, IActionTyped } from '../models/common';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actionTypes } from '../actions';
import axios, { AxiosResponse } from 'axios';
import { ILogin, IRegister } from '../models/auth';
import { push } from 'connected-react-router';
import { JWT_KEY } from '../utils/keys';

function* login(action: IActionTyped<ILogin>) {
  try {
    const token = yield call(loginCall, action.payload);
    localStorage.setItem(JWT_KEY, token);
    yield put(push('/'));
  } catch {
    console.log('Error');
  }
}

const loginCall = (loginData: ILogin) =>
  axios.post('/api/users/login', loginData).then((response: AxiosResponse) => response.data);

function* register(action: IActionTyped<IRegister>) {
  try {
    const companyID = yield call(registerCall, action.payload);
    console.log(companyID);
  } catch {
    console.log('Error');
  }
}

const registerCall = (registerData: IRegister) =>
  axios.post('/api/users/register', registerData).then((response: AxiosResponse) => response.data);

export const authSaga = [
  takeLatest(actionTypes.auth.LOGIN, (action: IActionTyped<ILogin>) => login(action)),
  takeLatest(actionTypes.auth.REGISTER, (action: IActionTyped<IRegister>) => register(action)),
];
