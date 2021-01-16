package controllers

import cats.Monad
import cats.effect.Sync
import cats.implicits._
import doobie.util.transactor.Transactor
import io.chrisdavenport.log4cats.Logger
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax._
import models.{CompanyToCreate, User, UserToCreate}
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import org.http4s.{AuthedRoutes, HttpRoutes}
import services.{AuthService, CompanyService, UserService}
import models.User._
import models.Company._
import doobie.implicits._
case class LoginForm(email: String, password: String)
case class UserWithCompanyForm(user: UserToCreate, company: CompanyToCreate)
class UserController[F[_]: Sync: Monad](
  service: UserService[F],
  companyService: CompanyService[F],
  authService: AuthService[F],
  xa: Transactor[F]
) extends Http4sDsl[F]
    with BaseController {
  implicit def unsafeLogger[F[_]: Sync]                 = Slf4jLogger.getLogger[F]
  private implicit val loginFormDecoder                 = deriveDecoder[LoginForm]
  private implicit val loginFormEntityDecoder           = CirceEntityDecoder.circeEntityDecoder[F, LoginForm]
  private implicit val userWithCompanyFormDecoder       = deriveDecoder[UserWithCompanyForm]
  private implicit val userWithCompanyFormEntityDecoder = CirceEntityDecoder.circeEntityDecoder[F, UserWithCompanyForm]
  private implicit val userEntityEncoder                = CirceEntityEncoder.circeEntityEncoder[F, User]
  private val openRoutes: HttpRoutes[F] = {
    HttpRoutes.of {
      case req @ POST -> Root / "login"    =>
        req
          .decode[LoginForm] { loginForm =>
            authService
              .verifyLogin(loginForm.email, loginForm.password)
              .flatMap {
                case Some(token) => Ok(token)
                case None        => Forbidden()
              }
          }
          .handleErrorWith(error => BadRequest(error.getMessage))
      case req @ POST -> Root / "register" =>
        req.decode[UserWithCompanyForm] { userWithCompanyForm =>
          companyService
            .createWithUser(userWithCompanyForm.company, userWithCompanyForm.user)
            .flatMap(id => Ok.apply(id.asJson))
        }
    }
  }
  private val authedRoutes: AuthedRoutes[User, F] = {
    AuthedRoutes.of {
      case GET -> Root / IntVar(userId) as user =>
        Ok(user.asJson)
      case GET -> Root as user                  =>
        Ok(service.getCompanyUsers(user.companyId).transact(xa).map(_.asJson))
    }
  }

  def routes: HttpRoutes[F] = openRoutes <+> authService.middleware(authedRoutes)
}
