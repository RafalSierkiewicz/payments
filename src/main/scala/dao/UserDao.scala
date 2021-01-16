package dao

import doobie.Fragment
import doobie.implicits._
import models.{User, UserToCreate}
class UserDao {

  private val tableName = Fragment.const("users")

  def insert(user: UserToCreate, companyId: Long): doobie.ConnectionIO[Long] = {
    val sql =
      fr"insert into" ++ tableName ++ fr"(username, email, password, company_id) values (${user.username}, ${user.email}, ${user.password}, ${companyId})"
    sql.update.withUniqueGeneratedKeys[Long]("id")
  }

  def getById(id: Long): doobie.ConnectionIO[Option[User]] = {
    select(fr"where id=$id").query[User].option
  }

  def getByEmail(email: String): doobie.ConnectionIO[Option[User]] = {
    select(fr"where email=$email").query[User].option
  }

  def listCompanyUsers(companyId: Long): fs2.Stream[doobie.ConnectionIO, User] = {
    select(fr"where company_id=$companyId").query[User].stream
  }

  private def select(where: Fragment) = {
    fr"select id, company_id, username, email, password, company_id from" ++ tableName ++ where
  }
}
