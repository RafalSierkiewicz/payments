package controllers
import cats.effect.{IO, Sync}
import cats.implicits._
import io.circe.fs2._
import io.circe.syntax._
import org.http4s.circe._
import org.http4s.{AuthedRoutes, HttpRoutes}
import org.http4s.dsl.Http4sDsl
import models.{ExpenseToCreate, User}
import services.{AuthService, ExpenseService}
import models.Expense._

class ExpenseController[F[_]: Sync](service: ExpenseService[F], authService: AuthService[F]) extends Http4sDsl[F] {

  val protectedRoutes: AuthedRoutes[User, F] = {
    AuthedRoutes.of {
      case GET -> Root as _        =>
        Ok.apply(
          service.list
            .map(exp => exp.asJson)
            .handleErrorWith(e => {
              fs2.Stream.empty
            })
        )
      case req @ POST -> Root as _ =>
        val inserted = req.req.body
          .through(_.through(byteStreamParser))
          .through(decoder[F, ExpenseToCreate])
          .through(_.evalMap(exp => service.insert(exp)).map(_.asJson))
        Ok.apply(inserted)
    }
  }

  val openRoutes: HttpRoutes[F] = {
    HttpRoutes.of[F] { case GET -> Root / "hello" =>
      Ok("hello")
    }
  }

  val routes: HttpRoutes[F] = authService.middleware(protectedRoutes) <+> openRoutes
}
