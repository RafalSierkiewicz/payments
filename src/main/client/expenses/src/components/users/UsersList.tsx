import * as React from 'react';
import { useSelector } from 'react-redux';
import { getUsers } from 'selectors';
import * as _ from 'lodash';
import { IUser } from 'models';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
const UsersList: React.FC = () => {
  const users = useSelector(getUsers);
  return (
    <Card>
      <ListGroup variant="flush">
        {_.map(users, (user: IUser) => {
          return (
            <ListGroup.Item key={user.id.toString()}>
              <Row noGutters={true} className="align-items-center">
                <Col sm={10}>{`${user.username || user.email}`}</Col>
                <Col sm>
                  <Button variant="danger">Remove</Button>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
};

export { UsersList };
