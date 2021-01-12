package services

import doobie._
import doobie.implicits._
import cats.effect.Bracket
import dao.UserDao
import doobie.util.transactor.Transactor
import models.{User, UserToCreate}

class UserService[F[_]](userDao: UserDao, xa: Transactor[F])(implicit ev: Bracket[F, Throwable]) {

  def getByEmail(email: String): F[Option[User]] = {
    userDao.getByEmail(email).option.transact(xa)
  }

  def getById(id: Long): F[Option[User]] = {
    userDao.getById(id).option.transact(xa)
  }

  def insert(user: UserToCreate): F[Long] = {
    userDao.insert(user).withUniqueGeneratedKeys[Long]("id").transact(xa)
  }
}
