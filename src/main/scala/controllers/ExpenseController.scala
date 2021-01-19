package controllers
import cats.effect.Sync
import cats.implicits._
import doobie.implicits._
import doobie.util.transactor.Transactor
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.circe.syntax._
import models.Charts._
import models.Expense._
import models.ExpenseSchema._
import models.ExpenseType._
import models.{ExpenseSchemaToCreate, ExpenseToCreate, ExpenseTypeToCreate, User}
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import org.http4s.{AuthedRoutes, EntityDecoder, HttpRoutes}
import services.{AuthService, ExpenseService}
class ExpenseController[F[_]: Sync](service: ExpenseService[F], authService: AuthService[F], xa: Transactor[F])
    extends Http4sDsl[F]
    with BaseController {
  implicit def unsafeLogger = Slf4jLogger.getLogger[F]

  private implicit val expenseToCreate: EntityDecoder[F, ExpenseToCreate]             = jsonOf[F, ExpenseToCreate]
  private implicit val expenseSchemaToCreate: EntityDecoder[F, ExpenseSchemaToCreate] = jsonOf[F, ExpenseSchemaToCreate]
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
      case req @ POST -> Root as _         =>
        for {
          expense <- req.req.as[ExpenseToCreate]
          resp    <-
            service
              .insert(expense)
              .transact(xa)
              .flatMap(_.map(id => Ok(id.asJson)).left.map {
                case models.ForeignKeyViolation => UnprocessableEntity("Schema not exist")
                case _                          => BadRequest()
              }.merge)
        } yield resp

      case _ @GET -> Root / "types" as user =>
        Ok.apply(service.listTypesByCompany(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root / "types" as user  =>
        Ok.apply(
          decodeRequest[F, ExpenseTypeToCreate](req.req)
            .through(_.evalMap(t => service.insertType(user.companyId, t).transact(xa)).map(_.asJson))
        )
      case req @ GET -> Root / "schemas" as user =>
        Ok.apply(service.listSchemasByCompany(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root / "schemas" as user =>
        Ok.apply(
          decodeRequest[F, ExpenseSchemaToCreate](req.req)
            .through(_.evalMap(t => service.insertSchema(user.companyId, t).transact(xa)).map(_.asJson))
        )
    }
  }

  private val openRoutes: HttpRoutes[F] = {
    HttpRoutes.of[F] { case GET -> Root / "hello" =>
      Ok("hello")
    }
  }

  def routes: HttpRoutes[F] = authService.middleware(protectedRoutes) <+> openRoutes
}
