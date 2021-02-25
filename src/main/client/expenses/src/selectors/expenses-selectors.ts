import { IAppState } from 'models';

const getExpenses = (state: IAppState) => state.expensesStore.expenses;
const getTypes = (state: IAppState) => state.expensesStore.types;
const getParts = (state: IAppState) => state.expensesStore.parts;
const getExpensesSchemas = (state: IAppState) => state.expensesStore.schemas;
const getSchemaChartData = (state: IAppState) => state.expensesStore.currentSchemaChartData;
const getCompanyChartData = (state: IAppState) => state.expensesStore.companyChart;
const getSchemaSummary = (state: IAppState) => state.expensesStore.currentSchemaSummary;
export {
  getExpenses,
  getTypes,
  getExpensesSchemas,
  getSchemaChartData,
  getCompanyChartData,
  getParts,
  getSchemaSummary,
};
