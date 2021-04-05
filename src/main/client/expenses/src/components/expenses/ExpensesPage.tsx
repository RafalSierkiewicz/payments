import React, { createRef } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { actions } from 'actions';
import { IAppState, IExpense, IExpensePart, IExpenseType, IUser } from 'models';
import * as Yup from 'yup';
import * as _ from 'lodash';
import { ExpensesList } from './ExpensesList';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { ExpenseSummary } from './ExpenseSummary';
import { ExpensesForm } from './forms/ExpensesForm';

const expenseSchema = Yup.object().shape({
  name: Yup.string(),
  price: Yup.number().required().positive().min(1),
  typeName: Yup.string().required(),
  user: Yup.string().required(),
  part: Yup.string().required(),
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
  priceParts: IExpensePart[];
  areExpensesLoading: boolean;
}

class ExpensesPageBase extends React.PureComponent<IExpensesPageProps> {
  private inputRef = createRef<HTMLInputElement>();

  componentDidMount() {
    const { dispatch, schemaId } = this.props;
    if (!_.isNaN(schemaId)) {
      dispatch(actions.expenses.loadSchemaExpensesStart(schemaId));
    }
  }

  componentDidUpdate(prevProps: Readonly<IExpensesPageProps>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.schemaId !== this.props.schemaId && !_.isNaN(this.props.schemaId)) {
      const { dispatch, schemaId } = this.props;
      dispatch(actions.expenses.loadSchemaExpensesStart(schemaId));
    }
  }

  render() {
    const { dispatch, types, users, schemaId, priceParts } = this.props;
    const defaultExpenseCreate = {
      name: '',
      price: 0.0,
      typeName: _.head(_.map(types, (t: IExpenseType) => t.name)) || '',
      user: _.head(_.map(users, (u: IUser) => u.username || u.email)) || '',
      part: _.head(_.map(priceParts, (u: IExpensePart) => u.name)) || '',
    };

    return (
      <Container>
        <ExpensesForm users={users} types={types} schemaId={schemaId} priceParts={priceParts} />
        {this.props.areExpensesLoading ? (
          <p>Loading</p>
        ) : (
          <>
            <ExpenseSummary />
            <ExpensesList />
          </>
        )}
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
    priceParts: state.expensesStore.parts,
    areExpensesLoading: state.expensesStore.areExpensesLoading,
  };
};
const ExpensesPage = connect(mapStateToProps)(withRouter(ExpensesPageBase));
export { ExpensesPage };
