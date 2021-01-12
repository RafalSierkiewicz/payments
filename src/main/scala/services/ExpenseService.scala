package services

import cats.effect.Bracket
import dao.ExpenseDao
import doobie.util.transactor.Transactor
import models.{Expense, ExpenseToCreate}
import doobie.implicits._

class ExpenseService[F[_]](expenseDao: ExpenseDao, xa: Transactor[F])(implicit ev: Bracket[F, Throwable]) {

  def list: fs2.Stream[F, Expense] = {
    expenseDao.list.stream.transact(xa)
  }

  def insert(expense: ExpenseToCreate): F[Long] = {
    expenseDao.insert(expense).withUniqueGeneratedKeys[Long]("id").transact(xa)
  }
}
