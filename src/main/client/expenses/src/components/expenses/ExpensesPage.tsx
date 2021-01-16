import React from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { actions } from 'actions';
import { IAppState, IExpense, IExpenseType, IUser } from 'models';
import * as Yup from 'yup';
import * as _ from 'lodash';
import { ExpensesList } from './ExpensesList';
import { Route, RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';

const expenseSchema = Yup.object().shape({
  name: Yup.string(),
  price: Yup.number().required().positive().min(1),
  typeName: Yup.string().required(),
  user: Yup.string().required(),
});

interface SchemaIdRouteProps {
  id: string;
}

interface IExpensesPageProps extends RouteComponentProps<SchemaIdRouteProps> {
  dispatch: Dispatch;
  schemaId: number;
  types: IExpenseType[];
  users: IUser[];
  expenses: IExpense[];
  areExpensesLoading: boolean;
}

class ExpensesPageBase extends React.PureComponent<IExpensesPageProps> {
  componentDidMount() {
    const { dispatch, schemaId } = this.props;
    dispatch(actions.expenses.loadSchemaExpensesStart(schemaId));
  }

  componentDidUpdate(prevProps: Readonly<IExpensesPageProps>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.schemaId !== this.props.schemaId) {
      const { dispatch, schemaId } = this.props;

      dispatch(actions.expenses.loadSchemaExpensesStart(schemaId));
    }
  }

  render() {
    const { dispatch, types, users, schemaId, expenses } = this.props;
    const defaultExpenseCreate = {
      name: '',
      price: 0.0,
      typeName: _.head(_.map(types, (t: IExpenseType) => t.name)) || '',
      user: _.head(_.map(users, (u: IUser) => u.username || u.email)) || '',
    };

    return (
      <Container>
        <Formik
          initialValues={defaultExpenseCreate}
          validationSchema={expenseSchema}
          onSubmit={(values, act) => {
            dispatch(
              actions.expenses.createExpense({
                name: values.name,
                price: values.price,
                typeId: _.find(types, (t: IExpenseType) => t.name === values.typeName)!!.id,
                userId: _.find(users, (t: IUser) => t.username === values.user || t.email === values.user)!!.id,
                schemaId: schemaId,
              })
            );

            act.setSubmitting(false);
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} controlId="expenseFormName">
                  <Form.Control
                    type="text"
                    placeholder="Enter expense name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="expenseFormPrice">
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    isInvalid={!!errors.price}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="expenseFormType">
                  <Form.Control
                    as="select"
                    placeholder="Select type"
                    name="typeName"
                    value={values.typeName}
                    onChange={handleChange}
                    isInvalid={!!errors.typeName}
                  >
                    {_.map(types, (type: IExpenseType) => {
                      return <option id={type.id.toString()}>{type.name}</option>;
                    })}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="expenseFormUser">
                  <Form.Control
                    as="select"
                    placeholder="Select user"
                    name="user"
                    value={values.user}
                    onChange={handleChange}
                  >
                    {_.map(users, (user: IUser) => {
                      return <option id={user.id.toString()}>{user.username || user.email}</option>;
                    })}
                  </Form.Control>
                </Form.Group>
                <div>
                  <Button size="sm" variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form.Row>
            </Form>
          )}
        </Formik>
        {this.props.areExpensesLoading ? <p>Loading</p> : <ExpensesList />}
      </Container>
    );
  }
}

const mapStateToProps = (state: IAppState, props: IExpensesPageProps) => {
  return {
    types: state.expensesStore.types,
    users: state.usersStore.users,
    expenses: state.expensesStore.expenses,
    schemaId: Number(props.match.params['id']),
    areExpensesLoading: state.expensesStore.areExpensesLoading,
  };
};
const ExpensesPage = connect(mapStateToProps)(withRouter(ExpensesPageBase));
export { ExpensesPage };