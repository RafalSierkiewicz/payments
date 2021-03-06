package dao

import doobie.implicits._
import doobie.util.fragment.Fragment
import models.expenses.{ExpenseType, ExpenseTypeToCreate}
class ExpenseTypeDao extends AppDao {
  val tableName: Fragment    = Fragment.const("company_expenses_types")
  val updateFields: Fragment = Fragment.const("company_id, name")

  def insert(companyId: Long, expenseTypeToCreate: ExpenseTypeToCreate): doobie.ConnectionIO[Long] = {
    insertQ(fr"($companyId, ${expenseTypeToCreate.name})").withUniqueGeneratedKeys[Long]("id")
  }
  def delete(id: Long, companyId: Long): doobie.ConnectionIO[Int] = {
    deleteQ(fr"where id = ${id} and company_id = ${companyId}").run
  }

  def getByName(companyId: Long, name: String): doobie.ConnectionIO[Option[ExpenseType]] = {
    selectQ[ExpenseType](fr"where company_id=${companyId} and name=${name}").option
  }

  def listByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseType] = {
    selectQ[ExpenseType](fr"where company_id=${companyId}").stream
  }

  def findById(id: Long): doobie.ConnectionIO[Option[ExpenseType]] =
    selectQ[ExpenseType](fr"where id = $id").option
}
