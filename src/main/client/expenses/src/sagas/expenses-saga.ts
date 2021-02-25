import axios, { AxiosResponse } from 'axios';
import { call, takeLatest, put } from 'redux-saga/effects';

import {
  IActionEmpty,
  IActionTyped,
  IExpenseCreate,
  IExpensePartCreate,
  IExpenseSchema,
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
];
