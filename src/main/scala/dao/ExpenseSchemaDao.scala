package dao
import java.sql.Timestamp
import java.time.Instant

import cats.effect.Bracket
import doobie.util.fragment.Fragment
import doobie.implicits._
import doobie.implicits.javasql._
import doobie.implicits.javatime._
import models.{ExpenseSchema, ExpenseSchemaToCreate}

class ExpenseSchemaDao {

  private val fieldsWithoutId: Fragment = Fragment.const("name, created_at")
  private val allFields: Fragment       = Fragment.const("id, company_id") ++ fieldsWithoutId
  private val tableName: Fragment       = Fragment.const("expense_schemas")

  def getCompanySchemas(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseSchema] = {
    val sql =
      fr"select id, company_id, name, created_at from " ++ tableName ++ fr"where company_id=$companyId order by created_at"
    sql.query[ExpenseSchema].stream
  }

  def getById(schemaId: Long, companyId: Long): doobie.ConnectionIO[ExpenseSchema] = {
    val sql =
      fr"select id, company_id, name, created_at from " ++ tableName ++ fr"where id=$schemaId and company_id=$companyId"
    sql.query[ExpenseSchema].unique
  }

  def insert(companyId: Long, schema: ExpenseSchemaToCreate): doobie.ConnectionIO[Long] = {
    val now = Timestamp.from(Instant.now())
    val sql =
      fr"insert into " ++ tableName ++ fr"(company_id, " ++ fieldsWithoutId ++ fr") values ($companyId, ${schema.name}, $now)"
    sql.update.withUniqueGeneratedKeys[Long]("id")
  }

}
