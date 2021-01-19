package dao
import java.sql.Timestamp
import java.time.Instant

import doobie.implicits._
import doobie.implicits.javasql._
import doobie.implicits.javatime._
import doobie.util.fragment.Fragment
import models.{Expense, ExpenseToCreate}

class ExpenseDao extends AppDao {
  val updateFields: Fragment = Fragment.const("schema_id, expense_type_id, user_id, name, price, created_at")
  val tableName: Fragment    = Fragment.const("expenses")

  def getBySchemaId(schemaId: Long): fs2.Stream[doobie.ConnectionIO, Expense] = {
    selectQ[Expense](fr" where schema_id=$schemaId").stream
  }

  def insert(expense: ExpenseToCreate): doobie.ConnectionIO[Long] = {
    val now = expense.createdAt
      .getOrElse(Timestamp.from(Instant.now()))
    insertQ(fr"(${expense.schemaId}, ${expense.typeId},${expense.userId}, ${expense.name}, ${expense.price}, ${now})")
      .withUniqueGeneratedKeys[Long]("id")
  }

}
