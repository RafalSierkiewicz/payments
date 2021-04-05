import * as React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader, SubMenu } from 'react-pro-sidebar';
import { BiArrowFromLeft, BiArrowFromRight, FiLogOut, GiExpense, ImUser } from 'react-icons/all';
import { Col, Row } from 'react-bootstrap';

interface ISidebarPros {
  toggled: boolean;
  onToggle: (value: boolean) => void;
}

const Sidebar: React.FC<ISidebarPros> = ({ toggled, onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <ProSidebar collapsed={collapsed} breakPoint="md" toggled={toggled} onToggle={onToggle}>
      <SidebarHeader>
        {collapsed ? (
          <div className="sidebar__header-collapsed" role="button" onClick={() => setCollapsed(!collapsed)}>
            <BiArrowFromLeft />
          </div>
        ) : (
          <Row className="sidebar__header" noGutters={true}>
            <Col sm="11">My App</Col>
            <Col>
              <div role="button" onClick={() => setCollapsed(!collapsed)}>
                <BiArrowFromRight />
              </div>
            </Col>
          </Row>
        )}
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu title="Expenses" icon={<GiExpense />}>
            <MenuItem>
              Schemas
              <NavLink to={'/expenses'} exact={false} />
            </MenuItem>
            <MenuItem>
              Types
              <NavLink to={'/expenses/types'} exact={false} />
            </MenuItem>
            <MenuItem>
              Settings
              <NavLink to={'/expenses/parts'} exact={false} />
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<ImUser />}>
            Users
            <NavLink to={'/users'} exact={true} />
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter className="sidebar__footer">
        <Row noGutters={true} className="justify-content-md-start">
          <Col sm={2}>
            <FiLogOut />
          </Col>
          <Col sm={3}>
            <NavLink to={'/logout'} exact={true}>
              Logout
            </NavLink>
          </Col>
        </Row>
      </SidebarFooter>
    </ProSidebar>
  );
};

export { Sidebar };
