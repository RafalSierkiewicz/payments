import { IActionEmpty, IActionTyped, IUser, IUserCreate, IUserUpdate } from 'models';

const loadAllUsersStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_ALL_USERS_START,
});

const createUser = (payload: IUserCreate): IActionTyped<IUserCreate> => ({
  payload,
  type: actionTypes.CREATE_USER,
});

const editUser = (payload: IUserUpdate): IActionTyped<IUserUpdate> => ({
  payload,
  type: actionTypes.EDIT_USER,
});

const loadAllUsersSuccess = (payload: IUser[]): IActionTyped<IUser[]> => ({
  payload,
  type: actionTypes.LOAD_ALL_USERS_SUCCESS,
});

const actionTypes = {
  LOAD_ALL_USERS_START: 'LOAD_ALL_USERS',
  LOAD_ALL_USERS_SUCCESS: 'LOAD_ALL_USERS_SUCCESS',
  CREATE_USER: 'CREATE_USER',
  EDIT_USER: 'CREATE_USER',
};

const actions = {
  loadAllUsersStart,
  loadAllUsersSuccess,
  createUser,
  editUser,
};

export { actionTypes, actions };
