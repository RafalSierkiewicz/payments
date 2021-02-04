import * as React from 'react';
import { NavLink, withRouter, Switch, Route } from 'react-router-dom';

const SidebarBase: React.FC<object> = React.memo(() => (
  <div className="sidebar">
    <h3 className="sidebar__title">Navigation</h3>

    <NavLink className="sidebar__link" activeClassName="sidebar__link--active" exact={true} to={'/expenses'}>
      <span className={'sidebar__link-text'}>Expenses</span>
    </NavLink>

    <Switch>
      <Route
        path={'/expenses'}
        render={(routeProps) => {
          return (
            <>
              <NavLink
                className="sidebar__link--inner"
                activeClassName="sidebar__link--active"
                exact={false}
                to={'/expenses/types'}
              >
                <span className={'sidebar__link-text'}>Types</span>
              </NavLink>
              <NavLink
                className="sidebar__link--inner"
                activeClassName="sidebar__link--active"
                exact={false}
                to={'/expenses/sheets'}
              >
                <span className={'sidebar__link-text'}>Sheets</span>
              </NavLink>
              <NavLink
                className="sidebar__link--inner"
                activeClassName="sidebar__link--active"
                exact={false}
                to={'/expenses/parts'}
              >
                <span className={'sidebar__link-text'}>Price parts</span>
              </NavLink>
            </>
          );
        }}
      />
    </Switch>
    <NavLink className="sidebar__link" activeClassName="sidebar__link--active" exact={true} to={'/users'}>
      <span className={'sidebar__link-text'}>Users</span>
    </NavLink>
    <NavLink className="sidebar__link" activeClassName="sidebar__link--active" exact={true} to={'/logout'}>
      <span className={'sidebar__link-text'}>Logout</span>
    </NavLink>
  </div>
));

const Sidebar = withRouter(SidebarBase);

export { Sidebar };
