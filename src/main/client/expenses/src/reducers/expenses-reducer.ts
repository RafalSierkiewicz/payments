import {
  IActionHandlers,
  IActionPayloadTyped,
  ICompanyBarCharts,
  IExpense,
  IExpenseSchema,
  IExpensesStore,
  IExpenseType,
  ISchemaBarChart,
} from 'models';
import { actionTypes } from 'actions';
import { createReducer } from 'utils/redux-helpers';

const defaultExpensesState: IExpensesStore = {
  expenses: [],
  currentSchemaChartData: {
    lineChart: { data: [] },
    barChart: {
      data: [],
    },
  },
  companyChart: { chartByType: { data: [] }, chartBySchema: { data: [] } },
  areExpensesLoading: false,
  types: [],
  schemas: [],
};

const actionHandlers: IActionHandlers<IExpensesStore> = {
  [actionTypes.expenses.LOAD_SCHEMA_EXPENSES]: (state) => ({
    ...state,
    areExpensesLoading: true,
  }),
  [actionTypes.expenses.LOAD_SCHEMA_EXPENSES_SUCCESS]: (state, { payload }: IActionPayloadTyped<IExpense[]>) => ({
    ...state,
    expenses: payload,
    areExpensesLoading: false,
  }),
  [actionTypes.expenses.LOAD_ALL_TYPES_SUCCESS]: (state, { payload }: IActionPayloadTyped<IExpenseType[]>) => ({
    ...state,
    types: payload,
  }),
  [actionTypes.expenses.LOAD_ALL_SCHEMAS_SUCCESS]: (state, { payload }: IActionPayloadTyped<IExpenseSchema[]>) => ({
    ...state,
    schemas: payload,
  }),
  [actionTypes.expenses.LOAD_SCHEMA_CHART_DATA_SUCCESS]: (
    state,
    { payload }: IActionPayloadTyped<ISchemaBarChart>
  ) => ({
    ...state,
    currentSchemaChartData: payload,
  }),
  [actionTypes.expenses.LOAD_COMPANY_CHART_SUCCESS]: (state, { payload }: IActionPayloadTyped<ICompanyBarCharts>) => ({
    ...state,
    companyChart: payload,
  }),
};

export const expensesReducer = createReducer(defaultExpensesState, actionHandlers);
export { defaultExpensesState };
