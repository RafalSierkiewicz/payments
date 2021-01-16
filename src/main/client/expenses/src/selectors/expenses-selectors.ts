import { IAppState } from 'models';

const getExpenses = (state: IAppState) => state.expensesStore.expenses;
const getTypes = (state: IAppState) => state.expensesStore.types;
const getExpensesSchemas = (state: IAppState) => state.expensesStore.schemas;

export { getExpenses, getTypes, getExpensesSchemas };
