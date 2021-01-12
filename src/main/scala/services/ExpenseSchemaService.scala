package services

import cats.effect.Bracket
import dao.ExpenseSchemaDao
import doobie.util.transactor.Transactor
import doobie.implicits._
import models.{ExpenseSchema, ExpenseSchemaToCreate}
class ExpenseSchemaService[F[_]](dao: ExpenseSchemaDao, xa: Transactor[F])(implicit ev: Bracket[F, Throwable]) {

  def getUserSchemas(userId: Long): fs2.Stream[F, ExpenseSchema] = {
    dao.getUserSchemas(userId).stream.transact(xa)
  }

  def insert(userId: Long, schema: ExpenseSchemaToCreate) = {
    dao.insert(userId, schema).run.transact(xa)
  }
}
