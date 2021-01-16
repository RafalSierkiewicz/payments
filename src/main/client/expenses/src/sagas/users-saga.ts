import axios, { AxiosResponse } from 'axios';
import { call, takeLatest, put } from 'redux-saga/effects';

import { IActionEmpty, IActionTyped, IExpenseTypeCreate } from 'models';
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

export const usersSaga = [takeLatest(actionTypes.users.LOAD_ALL_USERS_START, (action: IActionEmpty) => loadAllUsers())];
