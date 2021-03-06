import {
  IActionEmpty,
  IActionTyped,
  IBarChart,
  ICompanyBarCharts,
  IExpense,
  IExpenseCreate,
  IExpensePart,
  IExpensePartCreate,
  IExpenseSchema,
  IExpenseSchemaCreate,
  IExpenseType,
  IExpenseTypeCreate,
  ISchemaBarChart,
  ISummary,
} from 'models';

const loadAllExpensesStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_ALL_EXPENSES,
});

const loadSchemaExpensesStart = (payload: number): IActionTyped<number> => ({
  payload,
  type: actionTypes.LOAD_SCHEMA_EXPENSES,
});

const loadCompanyBarChartStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_COMPANY_CHART_START,
});

const loadCompanyBarChartSuccess = (payload: ICompanyBarCharts): IActionTyped<ICompanyBarCharts> => ({
  payload,
  type: actionTypes.LOAD_COMPANY_CHART_SUCCESS,
});

const loadAllTypesStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_ALL_TYPES_START,
});

const loadAllPartsStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_ALL_PARTS_START,
});

const createExpense = (payload: IExpenseCreate): IActionTyped<IExpenseCreate> => ({
  payload,
  type: actionTypes.CREATE_EXPENSE,
});

const createExpenseType = (payload: IExpenseTypeCreate): IActionTyped<IExpenseTypeCreate> => ({
  payload,
  type: actionTypes.CREATE_EXPENSE_TYPE,
});

const createExpenseSchema = (payload: IExpenseSchemaCreate): IActionTyped<IExpenseSchemaCreate> => ({
  payload,
  type: actionTypes.CREATE_EXPENSE_SCHEMA,
});

const createExpensePricePart = (payload: IExpensePartCreate): IActionTyped<IExpensePartCreate> => ({
  payload,
  type: actionTypes.CREATE_EXPENSE_PART,
});

const deleteExpense = (payload: IExpense): IActionTyped<IExpense> => ({
  payload,
  type: actionTypes.DELETE_EXPENSE,
});

const deleteExpenseType = (payload: IExpenseType): IActionTyped<IExpenseType> => ({
  payload,
  type: actionTypes.DELETE_EXPENSE_TYPE,
});

const deleteExpenseSchema = (payload: IExpenseSchema): IActionTyped<IExpenseSchema> => ({
  payload,
  type: actionTypes.DELETE_EXPENSE_SCHEMA,
});

const deleteExpensePricePart = (payload: IExpensePart): IActionTyped<IExpensePart> => ({
  payload,
  type: actionTypes.DELETE_EXPENSE_PART,
});

const loadAllPricePartsSuccess = (payload: IExpensePart[]): IActionTyped<IExpensePart[]> => ({
  payload,
  type: actionTypes.LOAD_ALL_PARTS_SUCCESS,
});

const loadAllSchemasStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_ALL_SCHEMAS_START,
});

const loadAllSchemasSuccess = (payload: IExpenseSchema[]): IActionTyped<IExpenseSchema[]> => ({
  payload,
  type: actionTypes.LOAD_ALL_SCHEMAS_SUCCESS,
});

const loadSchemaExpensesSuccess = (payload: IExpense[]): IActionTyped<IExpense[]> => ({
  payload,
  type: actionTypes.LOAD_SCHEMA_EXPENSES_SUCCESS,
});

const loadSchemaChartDataSuccess = (payload: ISchemaBarChart[]): IActionTyped<ISchemaBarChart[]> => ({
  payload,
  type: actionTypes.LOAD_SCHEMA_CHART_DATA_SUCCESS,
});

const loadSchemaSummarySuccess = (payload: ISummary): IActionTyped<ISummary> => ({
  payload,
  type: actionTypes.LOAD_SCHEMA_SUMMARY_SUCCESS,
});

const loadAllTypesSuccess = (payload: IExpenseType[]): IActionTyped<IExpenseType[]> => ({
  payload,
  type: actionTypes.LOAD_ALL_TYPES_SUCCESS,
});

const actionTypes = {
  LOAD_ALL_EXPENSES: 'LOAD_ALL_EXPENSES',
  LOAD_SCHEMA_EXPENSES: 'LOAD_SCHEMA_EXPENSES',
  LOAD_ALL_TYPES_START: 'LOAD_ALL_TYPES_START',
  LOAD_ALL_TYPES_SUCCESS: 'LOAD_ALL_TYPES_SUCCESS',
  LOAD_ALL_PARTS_SUCCESS: 'LOAD_ALL_PARTS_SUCCESS',
  LOAD_ALL_PARTS_START: 'LOAD_ALL_PARTS_START',

  LOAD_SCHEMA_EXPENSES_SUCCESS: 'LOAD_SCHEMA_EXPENSES_SUCCESS',
  LOAD_SCHEMA_CHART_DATA_SUCCESS: 'LOAD_SCHEMA_CHART_DATA_SUCCESS',
  LOAD_SCHEMA_SUMMARY_SUCCESS: 'LOAD_SCHEMA_SUMMARY_SUCCESS',
  LOAD_ALL_SCHEMAS_START: 'LOAD_ALL_SCHEMAS_START',
  LOAD_ALL_SCHEMAS_SUCCESS: 'LOAD_ALL_SCHEMAS_SUCCESS',
  CREATE_EXPENSE: 'CREATE_EXPENSE',
  CREATE_EXPENSE_TYPE: 'CREATE_EXPENSE_TYPE',
  CREATE_EXPENSE_SCHEMA: 'CREATE_EXPENSE_SCHEMA',
  CREATE_EXPENSE_PART: 'CREATE_EXPENSE_PART',

  DELETE_EXPENSE: 'DELETE_EXPENSE',
  DELETE_EXPENSE_TYPE: 'DELETE_EXPENSE_TYPE',
  DELETE_EXPENSE_SCHEMA: 'DELETE_EXPENSE_SCHEMA',
  DELETE_EXPENSE_PART: 'DELETE_EXPENSE_PART',

  LOAD_COMPANY_CHART_START: 'LOAD_COMPANY_CHART_START',
  LOAD_COMPANY_CHART_SUCCESS: 'LOAD_COMPANY_CHART_SUCCESS',
};

const actions = {
  loadAllExpensesStart,
  loadSchemaExpensesStart,
  loadSchemaExpensesSuccess,
  loadAllPartsStart,
  loadAllTypesStart,
  loadAllTypesSuccess,
  loadAllSchemasStart,
  loadAllSchemasSuccess,
  createExpense,
  createExpenseType,
  createExpenseSchema,
  createExpensePricePart,
  loadAllPricePartsSuccess,
  loadSchemaChartDataSuccess,
  loadCompanyBarChartStart,
  loadCompanyBarChartSuccess,
  loadSchemaSummarySuccess,
  deleteExpense,
  deleteExpensePricePart,
  deleteExpenseSchema,
  deleteExpenseType,
};

export { actionTypes, actions };
