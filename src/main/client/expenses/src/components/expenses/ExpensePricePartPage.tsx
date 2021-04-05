import React from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getParts } from '../../selectors';
import * as _ from 'lodash';
import { IExpensePart } from '../../models/expenses';
import { ExpensesPricePartForm } from './forms/ExpensePricePartForm';
import { actions } from 'actions';
import { RemoveButton } from '../common/IconButton';

const ExpensesPricePartPage: React.FC = React.memo(() => {
  const parts = useSelector(getParts);
  const dispatch = useDispatch();
  return (
    <Container>
      <ExpensesPricePartForm />
      <ListGroup variant="flush">
        {_.map(parts, (part: IExpensePart) => {
          return (
            <ListGroup.Item id={part.id.toString()}>
              <Row noGutters={true} className="align-items-center">
                <Col sm={6}>{`${part.name}`}</Col>
                <Col sm={5}>{`${part.percentile * 100}`}</Col>
                <Col sm>
                  <RemoveButton onClick={(e) => dispatch(actions.expenses.deleteExpensePricePart(part))} />
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
});

export { ExpensesPricePartPage };
