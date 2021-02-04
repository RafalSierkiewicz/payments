package services

import doobie.implicits._
import cats.effect.Bracket
import dao.CompanyDao
import doobie.util.transactor.Transactor
import models.{CompanyToCreate, UserToCreate}

class CompanyService[F[_]](dao: CompanyDao, userService: UserService[F], xa: Transactor[F])(implicit
  ev: Bracket[F, Throwable]
) {

  def createWithUser(company: CompanyToCreate, user: UserToCreate): F[Long] = {
    (for {
      id     <- dao.insert(company)
      userId <- userService.insert(user, id).map {
        case Some(value) => value
        case None        => throw new Exception("User cannot be created")
      }
    } yield userId).transact(xa)
  }
}
