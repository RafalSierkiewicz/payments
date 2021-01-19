import { IAppState } from 'models';

const getExpenses = (state: IAppState) => state.expensesStore.expenses;
const getTypes = (state: IAppState) => state.expensesStore.types;
const getExpensesSchemas = (state: IAppState) => state.expensesStore.schemas;
const getSchemaChartData = (state: IAppState) => state.expensesStore.currentSchemaChartData;
const getCompanyChartData = (state: IAppState) => state.expensesStore.companyChart;

export { getExpenses, getTypes, getExpensesSchemas, getSchemaChartData, getCompanyChartData };
