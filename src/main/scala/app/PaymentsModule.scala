package app
import app.config.AppConfig
import cats.effect.Sync
import com.softwaremill.macwire.wire
import controllers.ExpenseController
import dao.{ExpenseDao, UserDao}
import doobie.util.transactor.Transactor
import services.{AuthService, ExpenseService, UserService}

class PaymentsModule[F[_]: Sync](transactor: Transactor[F], config: AppConfig) extends Module[F] {

  lazy val authService: AuthService[F] = {
    val authConfig = config.authConfig
    wire[AuthService[F]]
  }

  lazy val userDao: UserDao            = wire[UserDao]
  lazy val userService: UserService[F] = wire[UserService[F]]

  lazy val expenseDao: ExpenseDao                           = wire[ExpenseDao]
  lazy val expenseService: ExpenseService[F]                = wire[ExpenseService[F]]
  override lazy val expenseController: ExpenseController[F] = wire[ExpenseController[F]]

}

object PaymentsModule {

  def make[F[_]: Sync](transactor: Transactor[F], config: AppConfig): PaymentsModule[F] = {
    new PaymentsModule[F](transactor, config)
  }
}
