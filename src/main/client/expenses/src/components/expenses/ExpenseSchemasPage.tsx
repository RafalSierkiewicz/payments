import React from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { ExpensesSchemaForm } from './forms/ExpenseSettingSchemaForm';
import * as _ from 'lodash';
import { IExpenseSchema } from '../../models/expenses';
import { useDispatch, useSelector } from 'react-redux';
import { getExpensesSchemas } from '../../selectors';
import { actions } from 'actions';
import { IconButton, RemoveButton } from '../common/IconButton';
import { ImBin2, IoSettingsOutline } from 'react-icons/all';
import { Link, useHistory } from 'react-router-dom';
import { LinkIconButton } from '../common/LinkIconButton';

const ExpensesSchemasPage: React.FC = React.memo(() => {
  const schemas = useSelector(getExpensesSchemas);
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <Container>
      <ExpensesSchemaForm />
      <ListGroup variant="flush">
        {_.map(schemas, (schema: IExpenseSchema) => {
          return (
            <ListGroup.Item id={schema.id.toString()}>
              <Row noGutters={true} className="align-items-center">
                <Col xs={11}>
                  <div
                    role="button"
                    onClick={(e) => history.push(`/expenses/schema/${schema.id}`)}
                  >{`${schema.name}`}</div>
                </Col>
                <Col xs>
                  <RemoveButton onClick={(e) => dispatch(actions.expenses.deleteExpenseSchema(schema))} />
                </Col>
                <Col xs>
                  <LinkIconButton to={`/users/edit/${schema.id}`} icon={<IoSettingsOutline />} iconColor="#ffc107" />
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
