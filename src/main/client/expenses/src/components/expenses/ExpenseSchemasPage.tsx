import React from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { ExpensesTypeForm } from './forms/ExpenseSettingTypeForm';
import { ExpensesSchemaForm } from './forms/ExpenseSettingSchemaForm';
import * as _ from 'lodash';
import { IExpenseSchema, IExpenseType } from '../../models/expenses';
import { useSelector } from 'react-redux';
import { getExpensesSchemas } from '../../selectors';

const ExpensesSchemasPage: React.FC = React.memo(() => {
  const schemas = useSelector(getExpensesSchemas);
  return (
    <Container>
      <ExpensesSchemaForm />
      <ListGroup variant="flush">
        {_.map(schemas, (schema: IExpenseSchema) => {
          return (
            <ListGroup.Item id={schema.id.toString()}>
              <Row noGutters={true} className="align-items-center">
                <Col sm={11}>{`${schema.name}`}</Col>
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

export { ExpensesSchemasPage };
