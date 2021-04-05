import * as React from 'react';
import { Bar, HorizontalBar } from 'react-chartjs-2';
import { Container } from 'react-bootstrap';
import * as _ from 'lodash';
import { getRandomColor } from 'utils';
import { IBarChart, ICompanyBarCharts } from 'models';
interface ICompanyExpenseChartProps {
  chartData: ICompanyBarCharts;
}
const CompanyExpenseChart: React.FC<ICompanyExpenseChartProps> = ({ chartData }) => {
  const chartByType = prepareChart(chartData.chartByType, 'Average by type');
  const chartBySchema = prepareChart(chartData.chartBySchema, 'Total expenses by schema');
  const options = { scales: { yAxes: [{ ticks: { mirror: true, padding: -10 } }] } };
  return (
    <Container>
      <HorizontalBar data={chartByType} options={options} />
      <HorizontalBar data={chartBySchema} options={options} />
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
