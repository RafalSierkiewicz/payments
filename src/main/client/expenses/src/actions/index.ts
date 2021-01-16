import * as expensesActions from 'actions/expenses/expenses-actions';
import * as authActions from 'actions/auth/auth-actions';
import * as usersActions from 'actions/users/users-actions';

const actionTypes = {
  expenses: expensesActions.actionTypes,
  auth: authActions.actionTypes,
  users: usersActions.actionTypes,
};

const actions = {
  expenses: expensesActions.actions,
  auth: authActions.actions,
  users: usersActions.actions,
};

export { actionTypes, actions };
