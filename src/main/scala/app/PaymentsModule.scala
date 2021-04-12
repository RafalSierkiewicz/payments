package app
import app.config.AppConfig
import cats.effect.{Blocker, ContextShift, Sync}
import com.softwaremill.macwire.wire
import controllers.expenses.{ExpenseController, ExpenseSchemaController, ExpenseTypesController}
import controllers.{HomeController, UserController}
import dao.{CompanyDao, ExpenseDao, ExpensePricePartDao, ExpenseSchemaDao, ExpenseTypeDao, UserDao}
import doobie.util.transactor.Transactor
import services.expenses.{ExpenseSchemaService, ExpenseService, ExpenseTypeService}
import services.{AuthService, CompanyService, UserService}

class PaymentsModule[F[_]: Sync: ContextShift](transactor: Transactor[F], config: AppConfig, blocker: Blocker)
    extends Module[F] {

  val authService: AuthService[F] = {
    val authConfig = config.authConfig
    wire[AuthService[F]]
  }

  lazy val expensePricePartDao: ExpensePricePartDao = wire[ExpensePricePartDao]
  lazy val companyDao: CompanyDao                   = wire[CompanyDao]
  lazy val companyService: CompanyService[F]        = wire[CompanyService[F]]

  lazy val userDao: UserDao                           = wire[UserDao]
  lazy val userService: UserService[F]                = wire[UserService[F]]
  override lazy val userController: UserController[F] = wire[UserController[F]]

  lazy val expenseDao: ExpenseDao                           = wire[ExpenseDao]
  lazy val expenseService: ExpenseService                   = wire[ExpenseService]
  override lazy val expenseController: ExpenseController[F] = wire[ExpenseController[F]]

  lazy val expenseSchemaDao: ExpenseSchemaDao                           = wire[ExpenseSchemaDao]
  lazy val expenseSchemaService: ExpenseSchemaService                   = wire[ExpenseSchemaService]
  override lazy val expenseSchemaController: ExpenseSchemaController[F] = wire[ExpenseSchemaController[F]]

  lazy val expenseTypeDao: ExpenseTypeDao                             = wire[ExpenseTypeDao]
  lazy val expenseTypeService: ExpenseTypeService                     = wire[ExpenseTypeService]
  override lazy val expenseTypesController: ExpenseTypesController[F] = wire[ExpenseTypesController[F]]

  override lazy val homeController: HomeController[F] = wire[HomeController[F]]
}

object PaymentsModule {

  def make[F[_]: Sync: ContextShift](
    transactor: Transactor[F],
    config: AppConfig,
    blocker: Blocker
  ): PaymentsModule[F] = {
    new PaymentsModule[F](transactor, config, blocker)
  }
}
