package dao
import java.sql.Timestamp
import java.time.Instant

import models.{Expense, ExpenseToCreate}
import doobie.implicits._
import doobie.implicits.javasql._, doobie.implicits.javatime._
import doobie.util.fragment.Fragment

class ExpenseDao {
  private val allFields: Fragment = Fragment.const("id, schema_id, name, price, created_at")
  private val tableName: Fragment = Fragment.const("expenses")

  def list: doobie.Query0[Expense] = {
    val sql = fr"select " ++ allFields ++ fr" from " ++ tableName
    sql.query[Expense]
  }

  def insert(expense: ExpenseToCreate): doobie.Update0 = {
    val now = expense.createdAt
      .getOrElse(Timestamp.from(Instant.now()))
    val sql =
      sql"insert into expenses (name, price, created_at) values (${expense.name}, ${expense.price}, ${now})"
    sql.update
  }

}
