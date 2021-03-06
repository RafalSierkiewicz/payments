package dao
import java.sql.Timestamp
import java.time.Instant

import doobie.implicits._
import doobie.implicits.javasql._
import doobie.implicits.javatime._
import doobie.util.fragment.Fragment
import models.expenses.{Expense, ExpenseToCreate}
import models.{BarChartData, SchemaExpensesChart}

class ExpenseDao extends AppDao {
  val updateFields: Fragment =
    Fragment.const("schema_id, expense_type_id, user_id, price_part, name, price, created_at")
  val tableName: Fragment    = Fragment.const("expenses")

  def getBySchemaId(schemaId: Long): fs2.Stream[doobie.ConnectionIO, Expense] = {
    selectQ[Expense](fr" where schema_id=$schemaId").stream
  }

  def insert(expense: ExpenseToCreate): doobie.ConnectionIO[Long] = {
    val now = expense.createdAt
      .getOrElse(Timestamp.from(Instant.now()))
    insertQ(
      fr"(${expense.schemaId}, ${expense.typeId},${expense.userId}, ${expense.pricePart},${expense.name}, ${expense.price}, ${now})"
    )
      .withUniqueGeneratedKeys[Long]("id")
  }
  def deleteBySchemaId(schemaId: Long): doobie.ConnectionIO[Int] = {
    deleteQ(fr"where schema_id = ${schemaId}").run
  }

  def getSchemaChartData(schemaId: Long): doobie.ConnectionIO[List[BarChartData]] = {
    getChartByTypesData(fr"where schema_id=${schemaId}")
  }
  def getCompanyTypeChartData(companyId: Long): doobie.ConnectionIO[List[BarChartData]] = {
    getChartByTypesData(fr"where schema_id in (select id from expense_schemas where company_id=${companyId})")
  }

  def getCompanySchemaChartData(companyId: Long): doobie.ConnectionIO[List[BarChartData]] = {
    val sql = sql"""select expense_schemas.name, coalesce(sum(expenses.price),0) from 
                   |	expense_schemas
                   |	left join  expenses on expenses.schema_id = expense_schemas.id
                   |	where expense_schemas.company_id = $companyId
                   |group by expense_schemas.name""".stripMargin

    sql.query[BarChartData].to[List]
  }

  private def getChartByTypesData(where: Fragment) = {
    val sql = fr"""select company_expenses_types.name, sum(price) from expenses 
                  left join company_expenses_types
                  on company_expenses_types.id = expense_type_id""" ++ where ++ fr"group by (company_expenses_types.name) order by company_expenses_types.name"
    sql.query[BarChartData].to[List]

  }

}
