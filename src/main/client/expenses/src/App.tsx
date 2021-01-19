import * as React from 'react';
import './App.css';
import { ExpensesModule, Sidebar, UsersModule, withAuth } from 'components';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import 'styles/index.scss';

const AppBase: React.FC = () => {
  return (
    <div className="app__wrapper">
      <Sidebar />
      <div className="app__container">
        <Switch>
          <Route path={'/expenses'} component={ExpensesModule} />
          <Route path={'/users'} component={UsersModule} />

          <Redirect to={'/'} />
        </Switch>
      </div>
    </div>
  );
};

export const App = withAuth(connect()(AppBase));
