package dao

import java.sql.Timestamp
import java.time.Instant

import models.{Company, CompanyToCreate}
import doobie.implicits._
import doobie.implicits.javasql._, doobie.implicits.javatime._
import doobie.util.fragment.Fragment

class CompanyDao extends AppDao {

  val tableName: Fragment             = Fragment.const("companies")
  override val updateFields: Fragment = Fragment.const("name, created_at")
  def insert(company: CompanyToCreate): doobie.ConnectionIO[Long] = {
    val now = Timestamp.from(Instant.now())
    insertQ(fr"(${company.name}, $now)").withUniqueGeneratedKeys[Long]("id")
  }

  def findById(id: Long): doobie.ConnectionIO[Option[Company]] = {
    selectQ[Company](fr"where id = ${id}").option
  }

}
