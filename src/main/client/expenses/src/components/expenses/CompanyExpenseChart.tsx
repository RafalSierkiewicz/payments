import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import { Container } from 'react-bootstrap';
import * as _ from 'lodash';
import { getRandomColor } from 'utils';
import { IBarChart, ICompanyBarCharts } from '../../models/expenses';
interface ICompanyExpenseChartProps {
  chartData: ICompanyBarCharts;
}
const CompanyExpenseChart: React.FC<ICompanyExpenseChartProps> = ({ chartData }) => {
  const chartByType = prepareChart(chartData.chartByType, 'Average by type');
  const chartBySchema = prepareChart(chartData.chartBySchema, 'Total expenses by schema');

  return (
    <Container>
      <Bar data={chartByType} />
      <Bar data={chartBySchema} />
    </Container>
  );
};

const prepareChart = (chartByType: IBarChart, title: string) => {
  const values = _.map(chartByType.data, (data) => data.sum);
  const borderWithBackgroundColor = getRandomColor(values);
  return {
    labels: _.map(chartByType.data, (data) => data.label),
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: _.map(borderWithBackgroundColor, (el: any) => el.background),
        borderColor: _.map(borderWithBackgroundColor, (el: any) => el.border),
        borderWidth: 1,
        order: 2,
      },
    ],
  };
};

export { CompanyExpenseChart };
