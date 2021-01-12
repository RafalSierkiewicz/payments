package dao
import cats.effect.Bracket
import doobie.util.fragment.Fragment
import doobie.implicits._, doobie.implicits.javasql._, doobie.implicits.javatime._
import models.{ExpenseSchema, ExpenseSchemaToCreate}

class ExpenseSchemaDao {

  private val fieldsWithoutId: Fragment = Fragment.const("name, created_at")
  private val allFields: Fragment       = Fragment.const("id, user_id") ++ fieldsWithoutId
  private val tableName: Fragment       = Fragment.const("expense_schemas")

  def getUserSchemas(userId: Long): doobie.Query0[ExpenseSchema] = {
    val sql = fr"select " ++ allFields ++ fr"from " ++ tableName ++ fr"where id=$userId"
    sql.query[ExpenseSchema]
  }

  def insert(userId: Long, schema: ExpenseSchemaToCreate): doobie.Update0 = {
    val sql =
      fr"insert into " ++ tableName ++ fr"(user_id, " ++ fieldsWithoutId ++ fr") values ($userId, ${schema.name}, ${schema.createdAt}"
    sql.update
  }

}
