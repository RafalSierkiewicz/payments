import * as React from 'react';
import { useState } from 'react';
import { ExpensesModule, Sidebar, UsersModule, withAuth } from 'components';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import 'styles/index.scss';
import { FaBars } from 'react-icons/all';

const AppBase: React.FC = () => {
  const [toggled, setToggled] = useState(false);
  const handleToggleSidebar = (value: boolean) => {
    setToggled(value);
  };
  return (
    <div className="app__wrapper">
      <div className="md">
        <Sidebar toggled={toggled} onToggle={handleToggleSidebar} />
      </div>
      <div className="app__main">
        <Switch>
          <Route path={'/expenses'} component={ExpensesModule} />
          <Route path={'/users'} component={UsersModule} />
          <Redirect to={'/'} />
        </Switch>
        <div className="sidebar__btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div>
      </div>
    </div>
  );
};

export const App = withAuth(connect()(AppBase));
