package dao
import app.PaymentsModule.PostgresContext
import cats.effect.Bracket
import doobie.util.transactor.Transactor
import models.Expense
import doobie.implicits._
import io.getquill._

class ExpenseDao[F[_]](context: PostgresContext, xa: Transactor[F])(implicit ev: Bracket[F, Throwable]) {
  import context._

  private implicit val schema: context.SchemaMeta[Expense] = schemaMeta[Expense]("expenses")

  def list(): fs2.Stream[F, Expense] =
    stream(quote{
      query[Expense]
    }).transact[F](xa)

  def insert(expense: Expense): F[Long] = {
    run(quote{
      query[Expense].insert(lift(expense)).returning(_.id)
    }).transact[F](xa)
  }

}
