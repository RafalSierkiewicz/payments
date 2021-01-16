import * as React from 'react';
import { compose, Dispatch } from 'redux';
import { actions } from 'actions';
import { IAppState, IExpense, IExpenseSchema, IExpenseType } from 'models';
import { Button, Container, Nav, Navbar, NavbarBrand, NavDropdown, NavLink, Row, Spinner } from 'react-bootstrap';
import { ExpensesPage } from 'components';
import { connect } from 'react-redux';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { ExpensesSettings } from './ExpensesSettings';
import * as _ from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IExpensesModuleBaseProps extends RouteComponentProps<any> {
  dispatch: Dispatch;
  areExpensesLoading: boolean;
  types: IExpenseType[];
  schemas: IExpenseSchema[];
}

class ExpensesModuleBase extends React.PureComponent<IExpensesModuleBaseProps> {
  componentDidMount() {
    this.props.dispatch(actions.expenses.loadAllTypesStart());
    this.props.dispatch(actions.expenses.loadAllSchemasStart());
  }

  render() {
    const { areExpensesLoading } = this.props;
    return (
      <Container fluid={true}>
        <Row className="navs">
          <Navbar bg="primary" variant="dark" expand="lg">
            <Link to="/expenses" className="mr-auto expenses__nav-link nav-link">
              Expenses
            </Link>
            <Navbar.Toggle aria-controls="expenses_sheet_nav" />
            <Navbar.Collapse id="expenses_sheet_nav">
              <Nav className="mr-auto">
                <NavDropdown id="expenses_sheet_dropdown" title="Sheets" className="expenses__nav-link">
                  {_.map(this.props.schemas, (schema: IExpenseSchema) => {
                    return (
                      <Row className="dropdown-item" id={schema.id.toString()}>
                        <Link to={`/expenses/schema/${schema.id}`} className="nav-item">
                          <p>{schema.name}</p>
                        </Link>
                      </Row>
                    );
                  })}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>

            <Link to="expenses/settings" className="mr-auto expenses__nav-link nav-link">
              Settings
            </Link>
          </Navbar>
        </Row>
        <Switch>
          <Route path={'/expenses/schema/:id'} component={ExpensesPage} />
          <Route exact={true} path={'/expenses/settings'} component={ExpensesSettings} />
        </Switch>
      </Container>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    areExpensesLoading: state.expensesStore.areExpensesLoading,
    types: state.expensesStore.types,
    schemas: state.expensesStore.schemas,
  };
};

const ExpensesModule = connect(mapStateToProps)(withRouter(ExpensesModuleBase));
export { ExpensesModule };
