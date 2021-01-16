import { IActionEmpty, IActionTyped, IExpense, IExpenseCreate, IExpenseType, IExpenseTypeCreate, IUser } from 'models';

const loadAllUsersStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_ALL_USERS_START,
});

const loadAllUsersSuccess = (payload: IUser[]): IActionTyped<IUser[]> => ({
  payload,
  type: actionTypes.LOAD_ALL_USERS_SUCCESS,
});

const actionTypes = {
  LOAD_ALL_USERS_START: 'LOAD_ALL_USERS',
  LOAD_ALL_USERS_SUCCESS: 'LOAD_ALL_USERS_SUCCESS',
};

const actions = {
  loadAllUsersStart,
  loadAllUsersSuccess,
};

export { actionTypes, actions };
