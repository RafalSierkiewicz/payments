package controllers

import cats.{Applicative, Monad}
import cats.effect.{ContextShift, Effect, IO, Sync}
import cats.implicits._

import io.circe.fs2.decoder
import io.circe.{Decoder, Json}
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax._
import models.User._
import models.UserToCreate
import org.http4s.{AuthedRoutes, EntityDecoder, HttpRoutes}
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import services.{AuthService, UserService}

case class LoginForm(email: String, password: String)
case class UserWithCompany(user: UserToCreate, company: String)
class UserController[F[_]: Sync: Monad](service: UserService[F], authService: AuthService[F])
    extends Http4sDsl[F]
    with BaseController {
  implicit val loginFormDecoder                                    = deriveDecoder[LoginForm]
  implicit val loginFormEntityDecoder: EntityDecoder[F, LoginForm] = CirceEntityDecoder.circeEntityDecoder[F, LoginForm]
  val openRoutes: HttpRoutes[F] = {
    HttpRoutes.of {
      case req @ POST -> Root           =>
        Ok.apply(
          decodeRequest[F, UserToCreate](req)
            .through(
              _.through(hashUserPassword)
                .evalMap(service.insert)
                .map(_.asJson)
            )
        )
      case req @ POST -> Root / "login" =>
        req.decode[LoginForm] { loginForm =>
          authService.verifyLogin(loginForm.email, loginForm.password).flatMap {
            case Some(token) => Ok(token)
            case None        => Forbidden()
          }
        }
    }
  }

  private def hashUserPassword: fs2.Pipe[F, UserToCreate, UserToCreate] = { userToCreate =>
    userToCreate
      .filter(user => authService.hashPassword(user.password).isDefined)
      .map(user => user.copy(password = authService.hashPassword(user.password).get))
  }

}
