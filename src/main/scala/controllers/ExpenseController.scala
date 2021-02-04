package controllers
import cats.effect.Sync
import cats.implicits._
import doobie.implicits._
import doobie.util.transactor.Transactor
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.circe.syntax._
import models.Charts._
import models.User
import models.expenses.Expense._
import models.expenses.ExpensePricePart._
import models.expenses.ExpenseSchema._
import models.expenses.ExpenseType._
import models.expenses.{ExpensePricePartCreate, ExpenseSchemaToCreate, ExpenseToCreate, ExpenseTypeToCreate}
import org.http4s.circe._
import org.http4s.{AuthedRoutes, EntityDecoder, HttpRoutes}
import services.{AuthService, ExpenseService}
import utils.SqlStateToResponseMapper._

class ExpenseController[F[_]: Sync](service: ExpenseService[F], authService: AuthService[F], xa: Transactor[F])
    extends BaseController[F] {
  implicit def unsafeLogger = Slf4jLogger.getLogger[F]

  private implicit val expenseToCreate: EntityDecoder[F, ExpenseToCreate]               = jsonOf[F, ExpenseToCreate]
  private implicit val expenseSchemaToCreate: EntityDecoder[F, ExpenseSchemaToCreate]   = jsonOf[F, ExpenseSchemaToCreate]
  private implicit val expenseTypeToCreate: EntityDecoder[F, ExpenseTypeToCreate]       = jsonOf[F, ExpenseTypeToCreate]
  private implicit val expensePricePartCreate: EntityDecoder[F, ExpensePricePartCreate] =
    jsonOf[F, ExpensePricePartCreate]

  private val protectedRoutes: AuthedRoutes[User, F] = {
    AuthedRoutes.of {
      case GET -> Root / IntVar(id) as user             =>
        Ok.apply(
          service
            .findExpensesBySchemaId(id, user.companyId)
            .transact(xa)
            .map(exp => exp.asJson)
            .handleErrorWith(e => {
              Logger[F].error(s"Error while retrieving data: ${e.getMessage}")
              fs2.Stream.empty
            })
        )
      case GET -> Root / IntVar(id) / "summary" as user =>
        Ok.apply(
          service
            .getExpensesChartsData(id, user.companyId)
            .transact(xa)
            .map(exp => exp.asJson)
        )

      case GET -> Root / "summary" as user =>
        Ok.apply(
          service
            .getCompanyChartData(user.companyId)
            .transact(xa)
            .map(exp => exp.asJson)
        )

      case req @ POST -> Root as _ =>
        parseBody[ExpenseToCreate](req.req) { expense =>
          service
            .insert(expense)
            .transact(xa)
            .flatMap(_.map(id => Ok(id.asJson)).sqlStateToResponse)
        }

      case GET -> Root / "types" as user =>
        Ok.apply(service.listTypesByCompany(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root / "types" as user =>
        parseBody[ExpenseTypeToCreate](req.req) { typeToCreate =>
          service
            .insertType(user.companyId, typeToCreate)
            .transact(xa)
            .flatMap(_.map(id => Ok(id.asJson)).sqlStateToResponse)
        }

      case GET -> Root / "schemas" as user =>
        Ok.apply(service.listSchemasByCompany(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root / "schemas" as user =>
        parseBody[ExpenseSchemaToCreate](req.req) { schemaToCreate =>
          service
            .insertSchema(user.companyId, schemaToCreate)
            .transact(xa)
            .flatMap(_.map(id => Ok(id.asJson)).sqlStateToResponse)
        }

      case GET -> Root / "parts" as user =>
        Ok.apply(service.listPartsByCompany(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root / "parts" as user =>
        parseBody[ExpensePricePartCreate](req.req) { partToCreate =>
          service
            .insertPart(user.companyId, partToCreate)
            .transact(xa)
            .flatMap(_.map(id => Ok(id.asJson)).sqlStateToResponse)
        }
    }
  }

  def routes: HttpRoutes[F] = authService.middleware(protectedRoutes)
}
