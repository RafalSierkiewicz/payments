package app
import app.config.AppConfig
import cats.effect.Sync
import com.softwaremill.macwire.wire
import controllers.{ExpenseController, UserController}
import dao.{CompanyDao, ExpenseDao, ExpenseSchemaDao, ExpenseTypeDao, UserDao}
import doobie.util.transactor.Transactor
import services.{AuthService, CompanyService, ExpenseService, UserService}

class PaymentsModule[F[_]: Sync](transactor: Transactor[F], config: AppConfig) extends Module[F] {

  lazy val expenseTypeDao: ExpenseTypeDao     = wire[ExpenseTypeDao]
  lazy val expenseSchemaDao: ExpenseSchemaDao = wire[ExpenseSchemaDao]
  lazy val companyDao: CompanyDao             = wire[CompanyDao]
  lazy val companyService: CompanyService[F]  = wire[CompanyService[F]]

  lazy val userDao: UserDao            = wire[UserDao]
  lazy val userService: UserService[F] = wire[UserService[F]]
  val authService: AuthService[F] = {
    val authConfig = config.authConfig
    wire[AuthService[F]]
  }

  override lazy val userController: UserController[F] = wire[UserController[F]]

  lazy val expenseDao: ExpenseDao                           = wire[ExpenseDao]
  lazy val expenseService: ExpenseService[F]                = wire[ExpenseService[F]]
  override lazy val expenseController: ExpenseController[F] = wire[ExpenseController[F]]

}

object PaymentsModule {

  def make[F[_]: Sync](transactor: Transactor[F], config: AppConfig): PaymentsModule[F] = {
    new PaymentsModule[F](transactor, config)
  }
}
