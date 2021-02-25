package services

import cats.effect.Bracket
import dao.{ExpenseDao, ExpensePricePartDao, ExpenseSchemaDao, ExpenseTypeDao}
import doobie.`enum`.SqlState
import doobie.implicits._
import models._
import models.expenses.{
  Expense,
  ExpensePricePart,
  ExpensePricePartCreate,
  ExpenseSchema,
  ExpenseSchemaToCreate,
  ExpenseToCreate,
  ExpenseType,
  ExpenseTypeToCreate,
  ExpensesSummary
}
import utils.ExpenseCalculator

class ExpenseService[F[_]](
  expenseDao: ExpenseDao,
  expenseTypeDao: ExpenseTypeDao,
  expenseSchemaDao: ExpenseSchemaDao,
  expensePricePartDao: ExpensePricePartDao
)(implicit ev: Bracket[F, Throwable]) {

  def findExpensesBySchemaId(schemaId: Long, companyId: Long): fs2.Stream[doobie.ConnectionIO, Expense] = {
    fs2.Stream.eval(expenseSchemaDao.getById(schemaId, companyId)).flatMap {
      case Some(_) => expenseDao.getBySchemaId(schemaId)
      case None    =>
        fs2.Stream
          .raiseError[doobie.ConnectionIO](NotExists(s"Schema ${schemaId} does not belong to company $companyId"))
    }
  }

  def getCompanyChartData(companyId: Long): doobie.ConnectionIO[CompanySummaryCharts] = {
    for {
      chartByType   <-
        expenseDao
          .getCompanyTypeChartData(companyId)
          .map(
            barChartDatas =>
              barChartDatas.map(chartData => BarChartData(chartData.label, chartData.sum / barChartDatas.size))
          )
          .map(BarChart)
      chartBySchema <- expenseDao.getCompanySchemaChartData(companyId).map(BarChart)
    } yield CompanySummaryCharts(chartByType, chartBySchema)
  }

  def getExpensesChartsData(schemaId: Long, companyId: Long): doobie.ConnectionIO[SchemaExpensesChart] = {
    for {
      _               <- expenseSchemaDao.getById(schemaId, companyId)
      schemaChartData <- expenseDao.getSchemaChartData(schemaId)
      companySummary  <-
        expenseDao
          .getCompanyTypeChartData(companyId)
          .map(_.filter(data => schemaChartData.exists(_.label == data.label)))
    } yield SchemaExpensesChart(BarChart(schemaChartData), LineChart(companySummary.map(_.sum)))
  }

  def getExpenseSchemaSummary(schemaId: Long, companyId: Long): doobie.ConnectionIO[ExpensesSummary] = {
    //can be made on stream TODO
    for {
      parts    <- expensePricePartDao.list(companyId).compile.toVector
      expenses <- expenseDao.getBySchemaId(schemaId).compile.toVector
    } yield ExpenseCalculator.calculate(expenses, parts)
  }

  def insert(expense: ExpenseToCreate): doobie.ConnectionIO[Either[SqlState, Long]] =
    expenseDao.insert(expense).attemptSqlState

  def listTypesByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseType] =
    expenseTypeDao.listByCompany(companyId)

  def insertType(companyId: Long, expenseType: ExpenseTypeToCreate): doobie.ConnectionIO[Either[SqlState, Long]] =
    expenseTypeDao.insert(companyId, expenseType).attemptSqlState

  def insertSchema(companyId: Long, expenseSchema: ExpenseSchemaToCreate): doobie.ConnectionIO[Either[SqlState, Long]] =
    expenseSchemaDao.insert(companyId, expenseSchema).attemptSqlState

  def listSchemasByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseSchema] =
    expenseSchemaDao.getCompanySchemas(companyId)

  def listPartsByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpensePricePart] =
    expensePricePartDao.list(companyId)

  def insertPart(companyId: Long, part: ExpensePricePartCreate): doobie.ConnectionIO[Either[SqlState, Long]] =
    expensePricePartDao.insert(companyId, part).attemptSqlState

}
