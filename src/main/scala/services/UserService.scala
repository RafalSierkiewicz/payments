package services

import cats.effect.{Bracket, Sync}
import dao.UserDao
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import models.{User, UserToCreate}
import utils.PasswordHasher

class UserService[F[_]: Sync](userDao: UserDao)(implicit ev: Bracket[F, Throwable]) {

  def getByEmail(email: String): doobie.ConnectionIO[Option[User]] = {
    userDao.getByEmail(email)
  }

  def getById(id: Long): doobie.ConnectionIO[Option[User]] = {
    userDao.getById(id)
  }

  def getCompanyUsers(companyId: Long) = {
    userDao.listCompanyUsers(companyId)
  }

  def insert(user: UserToCreate, companyId: Long): doobie.ConnectionIO[Long] = {
    PasswordHasher.hashPassword(user.password) match {
      case Some(pass) => userDao.insert(user.copy(password = pass), companyId)
      case None       => throw new Exception("Cannot perform operation. Hashing failed")
    }
  }
}
