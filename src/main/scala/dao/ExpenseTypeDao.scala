package dao

import models.ExpenseTypeToCreate
import doobie.implicits._
import doobie.util.fragment.Fragment
import models.ExpenseType
class ExpenseTypeDao extends AppDao {
  val tableName: Fragment    = Fragment.const("company_expenses_types")
  val updateFields: Fragment = Fragment.const("company_id, name")

  def insert(companyId: Long, expenseTypeToCreate: ExpenseTypeToCreate): doobie.ConnectionIO[Long] = {
    insertQ(fr"($companyId, ${expenseTypeToCreate.name})").withUniqueGeneratedKeys[Long]("id")
  }

  def listByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseType] = {
    selectQ[ExpenseType](fr"where company_id=${companyId}").stream
  }

  def findById(id: Long): doobie.ConnectionIO[Option[ExpenseType]] =
    selectQ[ExpenseType](fr"where id = $id").option
}
