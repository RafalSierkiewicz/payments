package services.expenses

import dao.{ExpenseDao, ExpensePricePartDao, ExpenseSchemaDao}
import doobie.`enum`.SqlState
import doobie.implicits._
import models._
import models.expenses._
import utils.ExpenseCalculator

class ExpenseService(
  expenseDao: ExpenseDao,
  expenseSchemaDao: ExpenseSchemaDao,
  expensePricePartDao: ExpensePricePartDao
) {

  def countExpensesByType(companyId: Long, typeId: Long) = {
    expenseDao.countByType(companyId, typeId)
  }

  def getById(schemaId: Long, companyId: Long): doobie.ConnectionIO[Option[ExpenseSchema]] = {
    expenseSchemaDao.getById(schemaId, companyId)
  }

  def findExpensesBySchemaId(schemaId: Long): fs2.Stream[doobie.ConnectionIO, Expense] = {
    expenseDao.getBySchemaId(schemaId)
  }

  def deleteExpenseById(expenseId: Long): doobie.ConnectionIO[Long] = {
    expenseDao.deleteByIdQ(expenseId).run.map(_.toLong)
  }

  def getCompanyChartData(companyId: Long): doobie.ConnectionIO[CompanySummaryCharts] = {
    for {
      schemaCount   <- expenseSchemaDao.count(companyId)
      chartByType   <-
        expenseDao
          .getCompanyTypeChartData(companyId)
          .map(
            barChartDatas =>
              barChartDatas.map(el => BarChartData(el.label, el.sum / (if (schemaCount == 0) 1 else schemaCount)))
          )
          .map(BarChart)
      chartBySchema <- expenseDao.getCompanySchemaChartData(companyId).map(BarChart)
    } yield CompanySummaryCharts(chartByType, chartBySchema)
  }

  def getExpensesChartsData(schemaId: Long, companyId: Long): doobie.ConnectionIO[SchemaExpensesChart] = {
    for {
      schemaCount     <- expenseSchemaDao.count(companyId)
      schemaChartData <- expenseDao.getSchemaChartData(schemaId)
      companySummary  <-
        expenseDao
          .getCompanyTypeChartData(companyId)
          .map(_.filter(data => schemaChartData.exists(_.label == data.label)))
    } yield SchemaExpensesChart(BarChart(schemaChartData), LineChart(companySummary.map(_.sum / schemaCount)))
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

  def listPartsByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpensePricePart] =
    expensePricePartDao.list(companyId)

  def insertPart(companyId: Long, part: ExpensePricePartCreate): doobie.ConnectionIO[Either[SqlState, Long]] =
    expensePricePartDao.insert(companyId, part).attemptSqlState

  def deletePart(id: Long, companyId: Long): doobie.ConnectionIO[Either[SqlState, Int]] =
    expensePricePartDao.deleteById(id, companyId).attemptSqlState

}
