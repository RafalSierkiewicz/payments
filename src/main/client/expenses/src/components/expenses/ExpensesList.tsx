import React from 'react';
import { IExpense, IExpenseType, IUser } from 'models';
import * as _ from 'lodash';
import { Accordion, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getExpenses, getTypes, getUsers } from 'selectors';
import { actions } from 'actions';
import { isEmpty, find } from 'lodash';
import { RemoveButton } from '../common/IconButton';

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
                  <Col xs={7} lg={10}>{`${_.find(types, (type: IExpenseType) => type.id === Number(key))!!.name}`}</Col>
                  <Col xs={5} lg={2}>{`${'Sum: ' + _.sumBy(expenses, (expense: IExpense) => expense.price)}`}</Col>
                </Row>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card>
                  <Card.Header>
                    <Row noGutters={true} className="align-items-center">
                      <Col xs={3}>Name</Col>
                      <Col xs={3}>Type</Col>
                      <Col xs={3}>User</Col>
                      <Col xs={2}>Price</Col>
                      <Col xs />
                    </Row>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {_.map(expenses, (expense: IExpense) => {
                      return (
                        <ListGroup.Item id={expense.id.toString()}>
                          <Row noGutters={true} className="align-items-center">
                            <Col xs={3}>{`${isEmpty(expense.name) ? 'Undef' : expense.name}`}</Col>
                            <Col xs={3}>{`${find(types, (t: IExpenseType) => t.id === expense.typeId)!.name}`}</Col>
                            <Col xs={3}>{`${(_.find(users, (user: IUser) => user.id === expense.userId) || { username: '' }).username
                              }`}</Col>
                            <Col xs={2}>{`${expense.price}`}</Col>
                            <Col xs>
                              <RemoveButton onClick={() => dispatch(actions.expenses.deleteExpense(expense))} />
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
