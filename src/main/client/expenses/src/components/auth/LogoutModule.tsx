import * as React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from 'actions';
import { JWT_KEY } from 'utils';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LogoutModule = React.memo(() => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    localStorage.removeItem(JWT_KEY);
    dispatch(actions.auth.logout());
  });

  return (
    <Container className="login">
      <Row className="justify-content-md-center">
        <Link to="/login">
          <Button variant="primary" type="submit" className="buttons__width">
            Login
          </Button>
        </Link>
      </Row>
    </Container>
  );
});
export { LogoutModule };
