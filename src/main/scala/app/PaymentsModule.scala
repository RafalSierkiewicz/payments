package app
import cats.effect.Sync
import com.softwaremill.macwire.wire
import controllers.PaymentsController
import dao.ExpenseDao
import doobie.util.transactor.Transactor
import doobie.quill.DoobieContext
import io.getquill.Literal
class PaymentsModule[F[_]: Sync](transactor: Transactor[F]) extends Module[F] {
  import PaymentsModule.PostgresContext
  val dc: PostgresContext = new DoobieContext.Postgres(Literal)

  lazy val expenseDao = {
    wire[ExpenseDao[F]]
  }
  override lazy val paymentsController: PaymentsController[F] = wire[PaymentsController[F]]

}

object PaymentsModule{

  type PostgresContext = DoobieContext.Postgres[Literal.type]

  def make[F[_]: Sync](transactor: Transactor[F]): PaymentsModule[F] = {
    new PaymentsModule[F](transactor)
  }
}