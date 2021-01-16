import { IActionHandlers, IActionPayloadTyped, IAuthStore, IUser, IUsersStore } from 'models';
import { createReducer } from 'utils/redux-helpers';
import { actionTypes } from '../actions';

const defaultUserState: IUsersStore = {
  users: [],
};

const actionHandlers: IActionHandlers<IUsersStore> = {
  [actionTypes.users.LOAD_ALL_USERS_SUCCESS]: (state, { payload }: IActionPayloadTyped<IUser[]>) => ({
    ...state,
    users: payload,
  }),
};

export const usersReducer = createReducer(defaultUserState, actionHandlers);
export { defaultUserState };
