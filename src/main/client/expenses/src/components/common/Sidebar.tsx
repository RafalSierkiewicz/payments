import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';

const SidebarBase: React.FC<object> = React.memo(() => (
  <div className="sidebar">
    <h3 className="sidebar__title">Navigation</h3>

    <NavLink className="sidebar__link" activeClassName="sidebar__link--active" exact={true} to={'/expenses'}>
      <span className={'sidebar__link-text'}>Expenses</span>
    </NavLink>
    <NavLink className="sidebar__link" activeClassName="sidebar__link--active" exact={true} to={'/logout'}>
      <span className={'sidebar__link-text'}>Logout</span>
    </NavLink>
  </div>
));

const Sidebar = withRouter(SidebarBase);

export { Sidebar };
