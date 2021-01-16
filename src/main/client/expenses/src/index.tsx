import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { appHistory, store } from './store/root-store';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { LoginModule, LogoutModule, RegisterModule } from 'components';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={appHistory}>
      <Switch>
        <Route exact={true} path="/logout" component={LogoutModule} />
        <Route exact={true} path={'/login'} component={LoginModule} />
        <Route exact={true} path={'/register'} component={RegisterModule} />
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
