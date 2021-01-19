import axios, { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import { IActionEmpty, IActionTyped, IUserCreate } from 'models';
import { actions, actionTypes } from 'actions';

function* loadAllUsers() {
  try {
    const users = yield call(fetchAllUsersCall);
    yield put(actions.users.loadAllUsersSuccess(users));
  } catch {
    console.log('Error');
  }
}

const fetchAllUsersCall = () => axios.get('/api/users').then((response: AxiosResponse) => response.data);

function* createUser(action: IActionTyped<IUserCreate>) {
  try {
    yield call(createUserCall, action.payload);
    yield put(actions.users.loadAllUsersStart());
  } catch {
    console.log('Error');
  }
}

const createUserCall = (user: IUserCreate) =>
  axios.post('/api/users', user).then((response: AxiosResponse) => response.data);

export const usersSaga = [
  takeLatest(actionTypes.users.LOAD_ALL_USERS_START, (action: IActionEmpty) => loadAllUsers()),
  takeLatest(actionTypes.users.CREATE_USER, (action: IActionTyped<IUserCreate>) => createUser(action)),
];
