interface IExpensesStore {
  expenses: IExpense[];
  types: IExpenseType[];
  schemas: IExpenseSchema[];
  currentSchemaSummary: ISummary;
  currentSchemaChartData: ISchemaBarChart;
  companyChart: ICompanyBarCharts;
  areExpensesLoading: boolean;
  parts: IExpensePart[];
}

interface IExpense {
  id: number;
  typeId: number;
  userId: number;
  schemaId: number;
  pricePart: number;
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
interface IExpensePart {
  id: number;
  name: string;
  percentile: number;
  isReturn: boolean;
}

interface IExpensePartCreate {
  name: string;
  percentile: number;
  isReturn: boolean;
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
  pricePart: number;
}

interface ISummary {
  usersSummary: IUserSummary[];
  total: ITotalSummary;
}

interface IUserSummary {
  userId: number;
  summary: ITotalSummary;
}

interface ITotalSummary {
  payed: number;
  pricePartsMap: SimpleMap;
  toReturn: number;
}

interface SimpleMap {
  [key: string]: number;
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
  IExpensePart,
  IExpensePartCreate,
  IUserSummary,
  ITotalSummary,
  ISummary,
  SimpleMap,
};
