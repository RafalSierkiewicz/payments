import React from 'react';
import { IExpense, IExpenseType, IUser } from 'models';
import * as _ from 'lodash';
import { Accordion, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getExpenses, getTypes, getUsers } from 'selectors';
import { actions } from 'actions';
import { isEmpty } from 'lodash';

const ExpensesList: React.FC = () => {
  const expenses = useSelector(getExpenses);
  const users = useSelector(getUsers);
  const types = useSelector(getTypes);
  const dispatch = useDispatch();
  const grouped = _.groupBy(expenses, (expense: IExpense) => expense.typeId);

  return (
    <>
      {_.map(grouped, (expenses: IExpense[], key) => {
        return (
          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0" className="expenses__list">
                <Row>
                  <Col sm={10}>{`${_.find(types, (type: IExpenseType) => type.id === Number(key))!!.name}`}</Col>
                  <Col sm={2}>{`${'Sum: ' + _.sumBy(expenses, (expense: IExpense) => expense.price)}`}</Col>
                </Row>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card>
                  <Card.Header>
                    <Row noGutters={true} className="align-items-center">
                      <Col sm={4}>Expense name</Col>
                      <Col sm={3}>Expense type</Col>
                      <Col sm={2}>User</Col>
                      <Col sm={2}>Price</Col>
                      <Col sm />
                    </Row>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {_.map(expenses, (expense: IExpense) => {
                      return (
                        <ListGroup.Item id={expense.id.toString()}>
                          <Row noGutters={true} className="align-items-center">
                            <Col sm={4}>{`${isEmpty(expense.name) ? 'Undefined' : expense.name}`}</Col>
                            <Col sm={3}>{`${expense.typeId}`}</Col>
                            <Col sm={2}>{`${
                              (_.find(users, (user: IUser) => user.id === expense.userId) || { username: '' }).username
                            }`}</Col>
                            <Col sm={2}>{`${expense.price}`}</Col>
                            <Col sm>
                              <Button
                                variant="danger"
                                onClick={() => dispatch(actions.expenses.deleteExpense(expense))}
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        );
      })}
    </>
  );
};

export { ExpensesList };
