import { IAuthStore, IExpensesStore, IUsersStore } from 'models';

interface IActionEmpty {
  type: string;
}

interface IActionTyped<T> {
  type: string;
  payload: T;
}

interface IActionPayloadTyped<T> {
  payload: T;
}

interface IAppState {
  expensesStore: IExpensesStore;
  authStore: IAuthStore;
  usersStore: IUsersStore;
  router?: {};
}

interface IActionHandlers<T> {
  [key: string]: (state: T, action: IActionPayloadTyped<any>) => T;
}

export type { IActionEmpty, IActionTyped, IActionPayloadTyped, IActionHandlers, IAppState };
