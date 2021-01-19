import * as React from 'react';
import { Dispatch } from 'redux';
import { Container, Navbar, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { UsersPage } from './UsersPage';

interface IUsersModuleBaseProps extends RouteComponentProps<any> {
  dispatch: Dispatch;
}

class UsersModuleBase extends React.PureComponent<IUsersModuleBaseProps> {
  render() {
    return (
      <Container fluid={true}>
        <Row className="navs">
          <Navbar bg="primary" variant="dark" expand="lg">
            <Link to="/users" className="mr-auto expenses__nav-link nav-link">
              Users
            </Link>
          </Navbar>
        </Row>
        <Container>
          <UsersPage />
        </Container>
      </Container>
    );
  }
}

const UsersModule = connect()(withRouter(UsersModuleBase));
export { UsersModule };
