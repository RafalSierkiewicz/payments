import { IAppState } from 'models';
import { defaultAuthState, defaultExpensesState, defaultUserState } from 'reducers';

export const defaultAppState: IAppState = {
  expensesStore: defaultExpensesState,
  authStore: defaultAuthState,
  usersStore: defaultUserState,
};
