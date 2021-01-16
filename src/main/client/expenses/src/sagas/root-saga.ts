import { all } from 'redux-saga/effects';
import { expensesSaga } from 'sagas/expenses-saga';
import { authSaga } from 'sagas/auth-saga';
import { usersSaga } from 'sagas/users-saga';

export function* rootSaga() {
  yield all([...expensesSaga, ...authSaga, ...usersSaga]);
}
