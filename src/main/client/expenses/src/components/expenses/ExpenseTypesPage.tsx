import React from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { ExpensesTypeForm } from './forms/ExpenseSettingTypeForm';
import { useDispatch, useSelector } from 'react-redux';
import { getTypes } from 'selectors';
import * as _ from 'lodash';
import { IExpenseType } from 'models';
import { actions } from 'actions';

const ExpensesTypesPage: React.FC = React.memo(() => {
  const types = useSelector(getTypes);
  const dispatch = useDispatch();
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
                  <Button variant="danger" onClick={() => dispatch(actions.expenses.deleteExpenseType(type))}>
                    Remove
                  </Button>
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
