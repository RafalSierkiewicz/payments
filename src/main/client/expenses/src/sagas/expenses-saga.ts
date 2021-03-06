import axios, { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  IActionEmpty,
  IActionTyped,
  IExpense,
  IExpenseCreate,
  IExpensePart,
  IExpensePartCreate,
  IExpenseSchema,
  IExpenseType,
  IExpenseTypeCreate,
} from 'models';
import { actions, actionTypes } from 'actions';

const axiosInstance = axios;

function* loadSchemaExpenses(action: IActionTyped<number>) {
  try {
    const expenses = yield call(fetchSchemaExpenseCall, action.payload);
    const chartData = yield call(fetchSchemaChartDataCall, action.payload);
    const summary = yield call(fetchSchemaSummaryCall, action.payload);
    yield put(actions.expenses.loadSchemaExpensesSuccess(expenses));
    yield put(actions.expenses.loadSchemaChartDataSuccess(chartData));
    yield put(actions.expenses.loadSchemaSummarySuccess(summary));
  } catch {
    console.log('Error');
  }
}

const fetchSchemaExpenseCall = (id: number) =>
  axiosInstance.get(`/api/expenses/${id}`).then((response: AxiosResponse) => response.data);

const fetchSchemaChartDataCall = (id: number) =>
  axiosInstance.get(`/api/expenses/${id}/summary/chart`).then((response: AxiosResponse) => response.data);

const fetchSchemaSummaryCall = (id: number) =>
  axiosInstance.get(`/api/expenses/${id}/summary`).then((response: AxiosResponse) => response.data);

function* loadAllExpenseTypes() {
  try {
    const expenseTypes = yield call(fetchAllExpenseTypesCall);

    yield put(actions.expenses.loadAllTypesSuccess(expenseTypes));
  } catch {
    console.log('Error');
  }
}

const fetchAllExpenseTypesCall = () =>
  axiosInstance.get('/api/expenses/types').then((response: AxiosResponse) => response.data);

function* loadAllExpenseSchemas() {
  try {
    const expenseSchemas = yield call(fetchAllExpenseSchemasCall);
    const companyChart = yield call(fetchCompanyChartDataCall);
    yield put(actions.expenses.loadAllSchemasSuccess(expenseSchemas));
    yield put(actions.expenses.loadCompanyBarChartSuccess(companyChart));
  } catch {
    console.log('Error');
  }
}

function* loadCompanyChartData() {
  try {
    const companyChart = yield call(fetchCompanyChartDataCall);
    yield put(actions.expenses.loadCompanyBarChartSuccess(companyChart));
  } catch {
    console.log('Error');
  }
}

const fetchCompanyChartDataCall = () =>
  axiosInstance.get(`/api/expenses/summary`).then((response: AxiosResponse) => response.data);

const fetchAllExpenseSchemasCall = () =>
  axiosInstance.get('/api/expenses/schemas').then((response: AxiosResponse) => response.data);

function* createExpenseType(action: IActionTyped<IExpenseTypeCreate>) {
  try {
    yield call(createExpenseTypeCall, action.payload);
    yield put(actions.expenses.loadAllTypesStart());
  } catch {
    console.log('Error');
  }
}

const createExpenseTypeCall = (expenseType: IExpenseTypeCreate) =>
  axiosInstance.post('/api/expenses/types', expenseType).then((response: AxiosResponse) => response.data);

function* deleteExpenseType(action: IActionTyped<IExpenseType>) {
  try {
    yield call(deleteExpenseTypeCall, action.payload);
    yield put(actions.expenses.loadAllTypesStart());
  } catch {
    console.log('Error');
  }
}

const deleteExpenseTypeCall = (expenseType: IExpenseType) =>
  axiosInstance.delete(`/api/expenses/types/${expenseType.id}`).then((response: AxiosResponse) => response.data);

function* createExpense(action: IActionTyped<IExpenseCreate>) {
  try {
    yield call(createExpenseCall, action.payload);
    yield put(actions.expenses.loadSchemaExpensesStart(action.payload.schemaId));
  } catch {
    console.log('Error');
  }
}

const createExpenseCall = (expenseType: IExpenseCreate) =>
  axiosInstance.post('/api/expenses', expenseType).then((response: AxiosResponse) => response.data);

function* deleteExpense(action: IActionTyped<IExpense>) {
  try {
    yield call(deleteExpenseCall, action.payload);
    yield put(actions.expenses.loadSchemaExpensesStart(action.payload.schemaId));
  } catch {
    console.log('Error');
  }
}
const deleteExpenseCall = (expense: IExpense) =>
  axiosInstance
    .delete(`/api/expenses/${expense.schemaId}/expense/${expense.id}`)
    .then((response: AxiosResponse) => response.data);

function* createExpenseSchema(action: IActionTyped<IExpenseSchema>) {
  try {
    yield call(createExpenseSchemaCall, action.payload);
    yield put(actions.expenses.loadAllSchemasStart());
  } catch {
    console.log('Error');
  }
}

const createExpenseSchemaCall = (expenseType: IExpenseSchema) =>
  axiosInstance.post('/api/expenses/schemas', expenseType).then((response: AxiosResponse) => response.data);

function* deleteExpenseSchema(action: IActionTyped<IExpenseSchema>) {
  try {
    yield call(deleteExpenseSchemaCall, action.payload);
    yield put(actions.expenses.loadAllSchemasStart());
  } catch {
    console.log('Error');
  }
}

const deleteExpenseSchemaCall = (expenseType: IExpenseSchema) =>
  axiosInstance.delete(`/api/expenses/schemas/${expenseType.id}`).then((response: AxiosResponse) => response.data);

function* createExpensePart(action: IActionTyped<IExpensePartCreate>) {
  try {
    yield call(createExpensePartCall, action.payload);
    yield put(actions.expenses.loadAllPartsStart());
  } catch {
    console.log('Error');
  }
}

const createExpensePartCall = (expenseType: IExpensePartCreate) =>
  axiosInstance.post('/api/expenses/parts', expenseType).then((response: AxiosResponse) => response.data);

function* deleteExpensePart(action: IActionTyped<IExpensePart>) {
  try {
    yield call(deleteExpensePartCall, action.payload);
    yield put(actions.expenses.loadAllPartsStart());
  } catch {
    console.log('Error');
  }
}

const deleteExpensePartCall = (expenseType: IExpensePart) =>
  axiosInstance.delete(`/api/expenses/parts/${expenseType.id}`).then((response: AxiosResponse) => response.data);

function* loadAllPriceParts() {
  try {
    const expensePart = yield call(fetchAllPricePartCall);

    yield put(actions.expenses.loadAllPricePartsSuccess(expensePart));
  } catch {
    console.log('Error');
  }
}

const fetchAllPricePartCall = () =>
  axiosInstance.get('/api/expenses/parts').then((response: AxiosResponse) => response.data);

export const expensesSaga = [
  takeLatest(actionTypes.expenses.LOAD_SCHEMA_EXPENSES, (action: IActionTyped<number>) => loadSchemaExpenses(action)),
  takeLatest(actionTypes.expenses.LOAD_ALL_TYPES_START, (action: IActionEmpty) => loadAllExpenseTypes()),
  takeLatest(actionTypes.expenses.LOAD_ALL_SCHEMAS_START, (action: IActionEmpty) => loadAllExpenseSchemas()),
  takeLatest(actionTypes.expenses.LOAD_COMPANY_CHART_START, (action: IActionEmpty) => loadCompanyChartData()),
  takeLatest(actionTypes.expenses.LOAD_ALL_PARTS_START, (action: IActionEmpty) => loadAllPriceParts()),
  takeLatest(actionTypes.expenses.CREATE_EXPENSE, (action: IActionTyped<IExpenseCreate>) => createExpense(action)),
  takeLatest(actionTypes.expenses.CREATE_EXPENSE_SCHEMA, (action: IActionTyped<IExpenseSchema>) =>
    createExpenseSchema(action)
  ),
  takeLatest(actionTypes.expenses.CREATE_EXPENSE_TYPE, (action: IActionTyped<IExpenseTypeCreate>) =>
    createExpenseType(action)
  ),
  takeLatest(actionTypes.expenses.CREATE_EXPENSE_PART, (action: IActionTyped<IExpensePartCreate>) =>
    createExpensePart(action)
  ),
  takeLatest(actionTypes.expenses.DELETE_EXPENSE, (action: IActionTyped<IExpense>) => deleteExpense(action)),
  takeLatest(actionTypes.expenses.DELETE_EXPENSE_SCHEMA, (action: IActionTyped<IExpenseSchema>) =>
    deleteExpenseSchema(action)
  ),
  takeLatest(actionTypes.expenses.DELETE_EXPENSE_TYPE, (action: IActionTyped<IExpenseType>) =>
    deleteExpenseType(action)
  ),
  takeLatest(actionTypes.expenses.DELETE_EXPENSE_PART, (action: IActionTyped<IExpensePart>) =>
    deleteExpensePart(action)
  ),
];
