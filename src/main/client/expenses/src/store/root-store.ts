import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import reduxSaga from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import { authReducer, expensesReducer, usersReducer } from 'reducers';
import { rootSaga } from 'sagas/root-saga';
import axios from 'axios';
import { actions, actionTypes } from 'actions';
import { defaultAppState } from './root-state';
import { JWT_KEY } from '../utils/keys';

const appHistory = createBrowserHistory();
const sagaMiddleware = reduxSaga();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const appStore = combineReducers({
  expensesStore: expensesReducer,
  authStore: authReducer,
  usersStore: usersReducer,
  router: connectRouter(appHistory),
});
const rootStore = (state: any, action: any) => {
  if (action.type === actionTypes.auth.LOGOUT) {
    state = defaultAppState;
  }
  return appStore(state, action);
};
const store = createStore(rootStore, composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(appHistory))));

axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(JWT_KEY)}`;
  return config;
});

axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error.response.status === 401) {
      window.location.replace('/logout');
    }
    return Promise.reject(error);
  }
);
sagaMiddleware.run(rootSaga);
store.dispatch(actions.users.loadAllUsersStart());

export { store, appHistory };
