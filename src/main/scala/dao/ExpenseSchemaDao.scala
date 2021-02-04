package dao
import java.sql.Timestamp
import java.time.Instant

import cats.effect.Bracket
import doobie.util.fragment.Fragment
import doobie.implicits._
import doobie.implicits.javasql._
import doobie.implicits.javatime._
import models.expenses.{ExpenseSchema, ExpenseSchemaToCreate}

class ExpenseSchemaDao extends AppDao {

  val updateFields: Fragment = Fragment.const("company_id, name, created_at")
  val tableName: Fragment    = Fragment.const("expense_schemas")

  def getCompanySchemas(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseSchema] = {
    selectQ[ExpenseSchema](fr"where company_id=$companyId order by created_at").stream
  }

  def getById(schemaId: Long, companyId: Long): doobie.ConnectionIO[Option[ExpenseSchema]] = {
    selectQ[ExpenseSchema](fr"where id=$schemaId and company_id=$companyId").option
  }

  def insert(companyId: Long, schema: ExpenseSchemaToCreate): doobie.ConnectionIO[Long] = {
    val now = Timestamp.from(Instant.now())
    insertQ(fr"($companyId, ${schema.name}, $now)").withUniqueGeneratedKeys[Long]("id")
  }

}
