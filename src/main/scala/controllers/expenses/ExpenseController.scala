package controllers.expenses

import cats.effect.Sync
import cats.implicits._
import controllers.BaseController
import controllers.validation.Validator
import doobie.implicits._
import doobie.util.transactor.Transactor
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.circe.syntax._
import models.Charts._
import models.User
import models.expenses.Expense._
import models.expenses.ExpensePricePart._
import models.expenses.ExpensesSummary._
import models.expenses._
import org.http4s.circe._
import org.http4s.{AuthedRoutes, EntityDecoder, HttpRoutes, Response}
import services.AuthService
import services.expenses.ExpenseService
import utils.SqlStateToResponseMapper._

class ExpenseController[F[_]](service: ExpenseService, authService: AuthService[F], xa: Transactor[F])(implicit
  val sync: Sync[F]
) extends BaseController[F]
    with Validator[F] {
  implicit def unsafeLogger = Slf4jLogger.getLogger[F]

  private implicit val expenseToCreate: EntityDecoder[F, ExpenseToCreate]               = jsonOf[F, ExpenseToCreate]
  private implicit val expensePricePartCreate: EntityDecoder[F, ExpensePricePartCreate] =
    jsonOf[F, ExpensePricePartCreate]
  private val protectedRoutes: AuthedRoutes[User, F] = {
    AuthedRoutes.of {
      case GET -> Root / IntVar(id) as user =>
        withSchema(id, user.companyId) { schema =>
          Ok.apply(service.findExpensesBySchemaId(schema.id).transact(xa).map(_.asJson))
        }

      case req @ POST -> Root as _ =>
        parseBody[ExpenseToCreate](req.req) { expense =>
          service
            .insert(expense)
            .transact(xa)
            .flatMap(_.map(id => Ok(id.asJson)).sqlStateToResponse)
        }

      case DELETE -> Root / IntVar(schemaId) / "expense" / IntVar(id) as user =>
        withSchema(schemaId, user.companyId) { _ =>
          Ok.apply(service.deleteExpenseById(id).transact(xa).map(_.asJson))
        }

      case GET -> Root / IntVar(id) / "summary" / "chart" as user =>
        withSchema(id, user.companyId) { _ =>
          Ok.apply(
            service
              .getExpensesChartsData(id, user.companyId)
              .transact(xa)
              .map(_.asJson)
          )
        }
      case GET -> Root / IntVar(id) / "summary" as user           =>
        withSchema(id, user.companyId) { _ =>
          Ok.apply(
            service
              .getExpenseSchemaSummary(id, user.companyId)
              .transact(xa)
              .map(exp => exp.asJson)
          )
        }

      case GET -> Root / "summary" as user =>
        Ok.apply(
          service
            .getCompanyChartData(user.companyId)
            .transact(xa)
            .map(exp => exp.asJson)
        )

      case GET -> Root / "parts" as user =>
        Ok.apply(service.listPartsByCompany(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root / "parts" as user =>
        parseBody[ExpensePricePartCreate](req.req) { partToCreate =>
          service
            .insertPart(user.companyId, partToCreate)
            .transact(xa)
            .flatMap(_.map(id => Ok(id.asJson)).sqlStateToResponse)
        }

      case DELETE -> Root / "parts" / IntVar(id) as user =>
        service.deletePart(id, user.companyId).transact(xa).flatMap(_.map(id => Ok(id.asJson)).sqlStateToResponse)
    }
  }

  def routes: HttpRoutes[F] = authService.middleware(protectedRoutes)

  private def withSchema(schemaId: Long, companyId: Long)(f: ExpenseSchema => F[Response[F]]): F[Response[F]] = {
    service.getById(schemaId, companyId).transact(xa).flatMap {
      case Some(schema) => f(schema)
      case None         => Response[F](status = BadRequest).pure[F]
    }
  }
}
