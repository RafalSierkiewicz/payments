package models

import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder

case class SchemaExpensesChart(barChart: BarChart, lineChart: LineChart)
case class CompanySummaryCharts(chartByType: BarChart, chartBySchema: BarChart)
case class BarChart(data: List[BarChartData])
case class BarChartData(label: String, sum: Long)
case class LineChart(data: List[Long])

object Charts {
  implicit val lineChartEncoder: Encoder[LineChart]                         = deriveEncoder[LineChart]
  implicit val barChartDataEncoder: Encoder[BarChartData]                   = deriveEncoder[BarChartData]
  implicit val barChartEncoder: Encoder[BarChart]                           = deriveEncoder[BarChart]
  implicit val schemaExpensesBarChartEncoder: Encoder[SchemaExpensesChart]  = deriveEncoder[SchemaExpensesChart]
  implicit val companySummaryBarChartEncoder: Encoder[CompanySummaryCharts] = deriveEncoder[CompanySummaryCharts]

}
