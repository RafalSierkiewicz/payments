import React from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { ExpensesTypeForm } from './forms/ExpenseSettingTypeForm';
import { useSelector } from 'react-redux';
import { getTypes } from 'selectors';
import * as _ from 'lodash';
import { IExpenseType } from 'models';

const ExpensesTypesPage: React.FC = React.memo(() => {
  const types = useSelector(getTypes);
  return (
    <Container>
      <ExpensesTypeForm />
      <ListGroup variant="flush">
        {_.map(types, (type: IExpenseType) => {
          return (
            <ListGroup.Item id={type.id.toString()}>
              <Row noGutters={true} className="align-items-center">
                <Col sm={11}>{`${type.name}`}</Col>
                <Col sm>
                  <Button variant="danger">Remove</Button>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
});

export { ExpensesTypesPage };
