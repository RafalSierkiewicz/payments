interface IExpensesStore {
  expenses: IExpense[];
  types: IExpenseType[];
  schemas: IExpenseSchema[];
  currentSchemaChartData: ISchemaBarChart;
  companyChart: ICompanyBarCharts;
  areExpensesLoading: boolean;
}

interface IExpense {
  id: number;
  typeId: number;
  userId: number;
  name: string | null;
  price: number;
  created_at: number;
}

interface ISchemaBarChart {
  barChart: IBarChart;
  lineChart: ILineChart;
}

interface ICompanyBarCharts {
  chartByType: IBarChart;
  chartBySchema: IBarChart;
}

interface IBarChart {
  data: IBarChartData[];
}
interface IBarChartData {
  label: string;
  sum: number;
}
interface ILineChart {
  data: number[];
}

interface IExpenseType {
  id: number;
  name: string;
}

interface IExpenseTypeCreate {
  name: string;
}

interface IExpenseSchemaCreate {
  name: string;
}

interface IExpenseSchema {
  id: number;
  companyId: number;
  name: string;
  createdAt: number;
}

interface IExpenseCreate {
  name?: string;
  price: number;
  typeId: number;
  userId: number;
  schemaId: number;
}

export type {
  IExpense,
  IExpensesStore,
  IExpenseCreate,
  IExpenseType,
  IExpenseTypeCreate,
  IExpenseSchema,
  IExpenseSchemaCreate,
  ISchemaBarChart,
  IBarChart,
  ICompanyBarCharts,
};
