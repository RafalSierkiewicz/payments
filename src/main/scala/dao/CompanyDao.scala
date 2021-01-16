package dao

import java.sql.Timestamp
import java.time.Instant

import models.{Company, CompanyToCreate}
import doobie.implicits._
import doobie.implicits.javasql._, doobie.implicits.javatime._
import doobie.util.fragment.Fragment

class CompanyDao {

  private def tableName = Fragment.const("companies")

  def insert(company: CompanyToCreate): doobie.ConnectionIO[Long] = {
    val now = Timestamp.from(Instant.now())
    val sql = fr"insert into" ++ tableName ++ fr" (name, created_at) values (${company.name}, $now)"
    sql.update.withUniqueGeneratedKeys[Long]("id")
  }

  def findById(id: Long): doobie.ConnectionIO[Option[Company]] = {
    val sql = fr"select id, name, created_at from " ++ tableName ++ fr"where id = ${id}"
    sql.query[Company].option
  }

}
