import * as React from 'react';
import { Dispatch } from 'redux';
import { actions } from 'actions';
import { IAppState, IBarChart, ICompanyBarCharts, IExpenseSchema, IExpenseType } from 'models';
import { Container, Nav, Navbar, NavDropdown, Row } from 'react-bootstrap';
import { ExpensesPage } from 'components';
import { connect } from 'react-redux';
import { Link, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { ExpensesSettings } from './ExpensesSettings';
import * as _ from 'lodash';
import { ExpensesCharts } from './ExpensesCharts';
import { CompanyExpenseChart } from './CompanyExpenseChart';

interface IExpensesModuleBaseProps extends RouteComponentProps<any> {
  dispatch: Dispatch;
  areExpensesLoading: boolean;
  types: IExpenseType[];
  schemas: IExpenseSchema[];
  chartData: ICompanyBarCharts;
}

class ExpensesModuleBase extends React.PureComponent<IExpensesModuleBaseProps> {
  componentDidMount() {
    this.props.dispatch(actions.expenses.loadAllTypesStart());
    this.props.dispatch(actions.expenses.loadAllSchemasStart());
  }

  render() {
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
                      <Row className="dropdown-item" key={schema.id.toString()}>
                        <Link to={`/expenses/schema/${schema.id}`} className="nav-item">
                          <p>{schema.name}</p>
                        </Link>
                      </Row>
                    );
                  })}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>

            <Link to="/expenses/settings" className="mr-auto expenses__nav-link nav-link">
              Settings
            </Link>
            <Link to="/expenses/charts" className="mr-auto expenses__nav-link nav-link">
              Charts
            </Link>
          </Navbar>
        </Row>
        <Container></Container>
        <Switch>
          <Route exact={true} path={'/expenses/schema/:id'} component={ExpensesPage} />
          <Route exact={true} path={'/expenses/settings'} component={ExpensesSettings} />
          <Route exact={true} path={'/expenses/charts'} component={ExpensesCharts} />
          <Route
            exact={true}
            path={'/expenses'}
            component={() => <CompanyExpenseChart chartData={this.props.chartData} />}
          />
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
    chartData: state.expensesStore.companyChart,
  };
};

const ExpensesModule = connect(mapStateToProps)(withRouter(ExpensesModuleBase));
export { ExpensesModule };
