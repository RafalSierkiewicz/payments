package dao
import doobie.implicits._
import doobie.util.fragment.Fragment
import models.expenses.{ExpensePricePart, ExpensePricePartCreate}
class ExpensePricePartDao extends AppDao {
  override val updateFields: Fragment = Fragment.const("company_id, name, percentile")
  override val tableName: Fragment    = Fragment.const("expenses_price_part")

  def list(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpensePricePart] =
    selectQ[ExpensePricePart](fr"where company_id=$companyId").stream

  def insert(companyId: Long, pricePart: ExpensePricePartCreate): doobie.ConnectionIO[Long] = {
    insertQ(fr"(${companyId}, ${pricePart.name}, ${pricePart.percentile})").withUniqueGeneratedKeys[Long]("id")
  }

  def findById(id: Long, companyId: Long): doobie.ConnectionIO[Option[ExpensePricePart]] = {
    selectQ[ExpensePricePart](fr"where company_id=$companyId and id=$id").option
  }
}
