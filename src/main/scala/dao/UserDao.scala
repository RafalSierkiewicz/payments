package dao

import doobie.Fragment
import doobie.implicits._
import models.{User, UserToCreate}
class UserDao {

  private val userFieldsWithoutId = Fragment.const("username, email, password")
  private val tableName           = Fragment.const("users")

  def insert(user: UserToCreate): doobie.Update0 = {
    val sql =
      fr"insert into" ++ tableName ++ fr"(" ++ userFieldsWithoutId ++ fr") values (${user.username}, ${user.email}, ${user.password})"
    sql.update
  }

  def getById(id: Long): doobie.Query0[User] = {
    val sql = fr"select id, " ++ userFieldsWithoutId ++ fr"from" ++ tableName ++ fr"where id=$id"
    sql.query[User]
  }

  def getByEmail(email: String): doobie.Query0[User] = {
    val sql = fr"select id, " ++ userFieldsWithoutId ++ fr"from" ++ tableName ++ fr"where email=$email"
    sql.query[User]
  }
}
