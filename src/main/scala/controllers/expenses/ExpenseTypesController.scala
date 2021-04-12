package controllers.expenses

import cats.effect.Sync
import cats.implicits._
import controllers.BaseController
import controllers.validation.Validator
import doobie.implicits._
import doobie.util.transactor.Transactor
import io.circe.syntax.EncoderOps
import models.User
import models.expenses.ExpenseType._
import models.expenses.{ExpenseSchema, ExpenseTypeToCreate}
import org.http4s.circe.{jsonOf, _}
import org.http4s.{AuthedRoutes, EntityDecoder, HttpRoutes, Response}
import services.AuthService
import services.expenses.{ExpenseSchemaService, ExpenseService, ExpenseTypeService}
import utils.SqlStateToResponseMapper._

class ExpenseTypesController[F[_]](
  service: ExpenseTypeService,
  expenseService: ExpenseService,
  authService: AuthService[F],
  xa: Transactor[F]
)(implicit val sync: Sync[F])
    extends BaseController[F]
    with Validator[F] {
  private implicit val expenseTypeToCreate: EntityDecoder[F, ExpenseTypeToCreate] = jsonOf[F, ExpenseTypeToCreate]

  private def expenseTypeCreateConstraints(companyId: Long) = ApiConstraints[ExpenseTypeToCreate] {
    ApiConstraintAsync(
      "name",
      "schema.name.reserved",
      model => service.getByName(companyId, model.name).transact(xa).map(_.isEmpty)
    )
  }

  private def expenseTypeDeleteConstraints(companyId: Long) = ApiConstraints[Long] {
    ApiConstraintAsync(
      "id",
      "expense.type.used",
      id => expenseService.countExpensesByType(companyId, id).map(_ == 0).transact(xa)
    )
  }

  private val protectedRoutes: AuthedRoutes[User, F] = {
    AuthedRoutes.of {
      case GET -> Root / "types" as user =>
        Ok.apply(service.listTypesByCompany(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root / "types" as user =>
        parseBody[ExpenseTypeToCreate](req.req) { typeToCreate =>
          withValidation(typeToCreate) {
            Ok(
              service
                .insertType(user.companyId, typeToCreate)
                .transact(xa)
                .map(_.asJson)
            )
          }(expenseTypeCreateConstraints(user.companyId))
        }

      case DELETE -> Root / "types" / LongVar(id) as user =>
        withValidation(id) {
          Ok(service.deleteType(id, user.companyId).transact(xa).map(_.asJson))
        }(expenseTypeDeleteConstraints(user.companyId))
    }
  }
  def routes: HttpRoutes[F]                                 = authService.middleware(protectedRoutes)
}
