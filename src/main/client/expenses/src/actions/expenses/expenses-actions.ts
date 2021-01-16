import {
  IActionEmpty,
  IActionTyped,
  IExpense,
  IExpenseCreate,
  IExpenseSchema,
  IExpenseSchemaCreate,
  IExpenseType,
  IExpenseTypeCreate,
} from 'models';

const loadAllExpensesStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_ALL_EXPENSES,
});

const loadSchemaExpensesStart = (payload: number): IActionTyped<number> => ({
  payload,
  type: actionTypes.LOAD_SCHEMA_EXPENSES,
});

const loadAllTypesStart = (): IActionEmpty => ({
  type: actionTypes.LOAD_ALL_TYPES_START,
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

const loadAllTypesSuccess = (payload: IExpenseType[]): IActionTyped<IExpenseType[]> => ({
  payload,
  type: actionTypes.LOAD_ALL_TYPES_SUCCESS,
});

const actionTypes = {
  LOAD_ALL_EXPENSES: 'LOAD_ALL_EXPENSES',
  LOAD_SCHEMA_EXPENSES: 'LOAD_SCHEMA_EXPENSES',
  LOAD_ALL_TYPES_START: 'LOAD_ALL_TYPES_START',
  LOAD_ALL_TYPES_SUCCESS: 'LOAD_ALL_TYPES_SUCCESS',
  LOAD_SCHEMA_EXPENSES_SUCCESS: 'LOAD_SCHEMA_EXPENSES_SUCCESS',
  LOAD_ALL_SCHEMAS_START: 'LOAD_ALL_SCHEMAS_START',
  LOAD_ALL_SCHEMAS_SUCCESS: 'LOAD_ALL_SCHEMAS_SUCCESS',
  CREATE_EXPENSE: 'CREATE_EXPENSE',
  CREATE_EXPENSE_TYPE: 'CREATE_EXPENSE_TYPE',
  CREATE_EXPENSE_SCHEMA: 'CREATE_EXPENSE_SCHEMA',
};

const actions = {
  loadAllExpensesStart,
  loadSchemaExpensesStart,
  loadSchemaExpensesSuccess,
  loadAllTypesStart,
  loadAllTypesSuccess,
  loadAllSchemasStart,
  loadAllSchemasSuccess,
  createExpense,
  createExpenseType,
  createExpenseSchema,
};

export { actionTypes, actions };
