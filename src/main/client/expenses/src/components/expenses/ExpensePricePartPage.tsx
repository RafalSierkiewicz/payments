import React from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { ExpensesTypeForm } from './forms/ExpenseSettingTypeForm';
import { useSelector } from 'react-redux';
import { getParts, getTypes } from '../../selectors';
import * as _ from 'lodash';
import { IExpensePart, IExpenseType } from '../../models/expenses';
import { ExpensesPricePartForm } from './forms/ExpensePricePartForm';

const ExpensesPricePartPage: React.FC = React.memo(() => {
  const parts = useSelector(getParts);

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

export { ExpensesPricePartPage };
