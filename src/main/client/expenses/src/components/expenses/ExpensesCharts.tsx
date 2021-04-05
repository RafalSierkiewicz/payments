import * as React from 'react';
import { Bar, HorizontalBar } from 'react-chartjs-2';
import { Container } from 'react-bootstrap';
import * as _ from 'lodash';
import { useSelector } from 'react-redux';
import { getSchemaChartData } from 'selectors';
import { getRandomColor } from 'utils';

const ExpensesCharts: React.FC = React.memo(() => {
  const chartData = useSelector(getSchemaChartData);
  const values = _.map(chartData.barChart.data, (data) => data.sum);
  const borderWithBackgroundColor = getRandomColor(values);
  const options = { scales: { yAxes: [{ ticks: { mirror: true, padding: -10 } }] } };

  const data = {
    labels: _.map(chartData.barChart.data, (data) => data.label),
    datasets: [
      {
        label: 'Schema expenses',
        data: values,
        backgroundColor: _.map(borderWithBackgroundColor, (el: any) => el.background),
        borderColor: _.map(borderWithBackgroundColor, (el: any) => el.border),
        borderWidth: 1,
        order: 2,
      },
      {
        label: 'Total expenses',
        data: chartData.lineChart.data,
        type: 'line',
        borderColor: 'rgba(0, 123, 255, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        order: 1,
      },
    ],
  };
  return (
    <Container>
      <HorizontalBar data={data} options={options} />
    </Container>
  );
});

export { ExpensesCharts };
