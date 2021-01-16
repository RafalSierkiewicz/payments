package dao

import models.ExpenseTypeToCreate
import doobie.implicits._
import doobie.util.fragment.Fragment
import models.ExpenseType
class ExpenseTypeDao {
  private val tableName = Fragment.const("company_expenses_types")

  def insert(companyId: Long, expenseTypeToCreate: ExpenseTypeToCreate): doobie.ConnectionIO[Long] = {
    val sql = sql"insert into company_expenses_types(company_id, name) values ($companyId, ${expenseTypeToCreate.name})"
    sql.update.withUniqueGeneratedKeys[Long]("id")
  }

  def listByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseType] = {
    select(fr"company_id=${companyId}").query[ExpenseType].stream
  }

  def findById(id: Long): doobie.ConnectionIO[Option[ExpenseType]] =
    select(fr"id = $id").query[ExpenseType].option

  def select(predicate: Fragment) = {
    fr"select id, company_id, name from" ++ tableName ++ fr"where " ++ predicate
  }
}
