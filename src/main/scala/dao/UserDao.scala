package dao

import doobie.Fragment
import doobie.implicits._
import models.{User, UserToCreate}
class UserDao extends AppDao {

  override val updateFields: Fragment = Fragment.const("company_id, username, email, password")
  val tableName: Fragment             = Fragment.const("users")

  def update(user: User): doobie.ConnectionIO[Long] = {
    val sql =
      sql"""update users set 
              username = ${user.username}, 
              email = ${user.email},
              password = ${user.password}           
           where id = ${user.id}"""
    sql.update.withUniqueGeneratedKeys[Long]("id")
  }

  def insert(user: UserToCreate, companyId: Long): doobie.ConnectionIO[Long] = {
    insertQ(fr"( ${companyId}, ${user.username}, ${user.email}, ${user.password})").withUniqueGeneratedKeys[Long]("id")
  }

  def getById(id: Long): doobie.ConnectionIO[Option[User]] = {
    selectQ[User](fr"where id=$id").option
  }

  def getByEmail(email: String): doobie.ConnectionIO[Option[User]] = {
    selectQ[User](fr"where email=$email").option
  }

  def listCompanyUsers(companyId: Long): fs2.Stream[doobie.ConnectionIO, User] = {
    selectQ[User](fr"where company_id=$companyId").stream
  }

  def getCompanyUserById(companyId: Long, userId: Long): doobie.ConnectionIO[Option[User]] = {
    selectQ[User](fr"where company_id=$companyId and id=$userId").option
  }
}
