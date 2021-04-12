package controllers.expenses

import cats.effect.Sync
import cats.implicits._
import controllers.BaseController
import controllers.validation.Validator
import doobie.implicits._
import doobie.util.transactor.Transactor
import io.circe.syntax.EncoderOps
import models.User
import models.expenses.ExpenseSchema._
import models.expenses.{ExpenseSchema, ExpenseSchemaToCreate}
import org.http4s.circe.{jsonOf, _}
import org.http4s.{AuthedRoutes, EntityDecoder, HttpRoutes, Response}
import services.AuthService
import services.expenses.{ExpenseSchemaService, ExpenseService}

class ExpensePartsController[F[_]](
  service: ExpenseService,
  expenseSchemaService: ExpenseSchemaService,
  authService: AuthService[F],
  xa: Transactor[F]
)(implicit val sync: Sync[F])
    extends BaseController[F]
    with Validator[F] {
  private def expenseCreateConstraints(companyId: Long) = ApiConstraints[ExpenseSchemaToCreate] {
    ApiConstraintAsync(
      "name",
      "schema.name.reserved",
      model => expenseSchemaService.getByName(companyId, model.name).transact(xa).map(_.isEmpty)
    )
  }

  private implicit val expenseSchemaToCreate: EntityDecoder[F, ExpenseSchemaToCreate] = jsonOf[F, ExpenseSchemaToCreate]
  private val protectedRoutes: AuthedRoutes[User, F] = {
    AuthedRoutes.of {
      case GET -> Root / "schemas" as user =>
        Ok(expenseSchemaService.listSchemasByCompany(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root / "schemas" as user =>
        parseBody[ExpenseSchemaToCreate](req.req) { schemaToCreate =>
          withValidation(schemaToCreate) {
            Ok(
              expenseSchemaService
                .insertSchema(user.companyId, schemaToCreate)
                .transact(xa)
                .map(_.asJson)
            )
          }(expenseCreateConstraints(user.companyId))

        }

      case DELETE -> Root / "schemas" / IntVar(id) as user =>
        withSchema(id, user.companyId) { _ =>
          Ok.apply(expenseSchemaService.deleteSchema(id, user.companyId).transact(xa).map(_.asJson))
        }
    }
  }
  def routes: HttpRoutes[F]                                                           = authService.middleware(protectedRoutes)

  private def withSchema(schemaId: Long, companyId: Long)(f: ExpenseSchema => F[Response[F]]): F[Response[F]] = {
    service.getById(schemaId, companyId).transact(xa).flatMap {
      case Some(schema) => f(schema)
      case None         => Response[F](status = BadRequest).pure[F]
    }
  }
}
