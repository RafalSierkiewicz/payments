import * as React from 'react';
import { useSelector } from 'react-redux';
import { getUsers } from 'selectors';
import * as _ from 'lodash';
import { IUser } from 'models';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ImBin2, IoSettingsOutline } from 'react-icons/all';
import { IconContext } from 'react-icons';
import { IconButton } from '../common/IconButton';
import { LinkIconButton } from '../common/LinkIconButton';
const UsersList: React.FC = () => {
  const users = useSelector(getUsers);
  return (
    <Card>
      <ListGroup variant="flush">
        {_.map(users, (user: IUser) => {
          return (
            <ListGroup.Item key={user.id.toString()}>
              <Row noGutters={true} className="align-items-center">
                <Col xs={10}>{`${user.username || user.email}`}</Col>
                <Col xs>
                  <LinkIconButton to={`/users/edit/${user.id}`} icon={<IoSettingsOutline />} iconColor="#ffc107" />
                </Col>
                <Col xs>
                  <LinkIconButton to={`/users/edit/${user.id}`} icon={<ImBin2 />} iconColor="#dc3545" />
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
