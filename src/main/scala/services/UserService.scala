package services

import cats.effect.{Bracket, Sync}
import cats.free.Free
import dao.UserDao
import cats.syntax.traverse._
import doobie.free.connection
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import models.{User, UserToCreate, UserUpdateModel}
import utils.PasswordHasher

class UserService[F[_]: Sync](userDao: UserDao)(implicit ev: Bracket[F, Throwable]) {

  def getByEmail(email: String): doobie.ConnectionIO[Option[User]] =
    userDao.getByEmail(email)

  def getById(id: Long): doobie.ConnectionIO[Option[User]] =
    userDao.getById(id)

  def getCompanyUsers(companyId: Long) =
    userDao.listCompanyUsers(companyId)

  def insert(user: UserToCreate, companyId: Long): doobie.ConnectionIO[Option[Long]] =
    PasswordHasher.hashPassword(user.password).traverse(pass => userDao.insert(user.copy(password = pass), companyId))

  def update(userUpdate: UserUpdateModel, userId: Int, companyId: Long): doobie.ConnectionIO[Option[Long]] = {
    for {
      user    <- userDao.getCompanyUserById(companyId, userId)
      updated <- user.traverse(
        user =>
          userDao.update(
            user.copy(
              username = userUpdate.username.orElse(user.username),
              password = userUpdate.password.getOrElse(user.password)
            )
          )
      )
    } yield updated
  }
}
