package dao
import java.sql.Timestamp
import java.time.Instant

import doobie.implicits._
import doobie.implicits.javasql._
import doobie.implicits.javatime._
import doobie.util.fragment.Fragment
import models.{Expense, ExpenseToCreate}

class ExpenseDao {
  private val allFields: Fragment = Fragment.const("id, schema_id, expense_type_id, user_id, name, price, created_at")
  private val tableName: Fragment = Fragment.const("expenses")

  def list: fs2.Stream[doobie.ConnectionIO, Expense] = {
    val sql = fr"select " ++ allFields ++ fr" from " ++ tableName
    sql.query[Expense].stream
  }
  def getBySchemaId(schemaId: Long): fs2.Stream[doobie.ConnectionIO, Expense] = {
    val sql = fr"select " ++ allFields ++ fr" from " ++ tableName ++ fr" where schema_id=$schemaId"
    sql.query[Expense].stream
  }

  def insert(expense: ExpenseToCreate): doobie.ConnectionIO[Long] = {
    val now = expense.createdAt
      .getOrElse(Timestamp.from(Instant.now()))
    val sql =
      sql"insert into expenses (expense_type_id, user_id, schema_id, name, price, created_at) values (${expense.typeId},${expense.userId}, ${expense.schemaId},${expense.name}, ${expense.price}, ${now})"
    sql.update.withUniqueGeneratedKeys[Long]("id")
  }

}
