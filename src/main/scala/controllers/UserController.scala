package controllers

import cats.Monad
import cats.effect.Sync
import cats.implicits._
import doobie.implicits._
import doobie.util.transactor.Transactor
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.circe.generic.semiauto.deriveDecoder
import io.circe.syntax._
import models.User._
import models.Company._
import models.{CompanyToCreate, User, UserToCreate, UserUpdateModel}
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import org.http4s.{AuthedRoutes, HttpRoutes}
import services.{AuthService, CompanyService, UserService}

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
  private implicit val userToCreateEncoder              = jsonOf[F, UserToCreate]
  private implicit val userUpdateModelEncoder           = jsonOf[F, UserUpdateModel]

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
      case GET -> Root / IntVar(_) as user         =>
        Ok(user.asJson)
      case GET -> Root as user                     =>
        Ok(service.getCompanyUsers(user.companyId).transact(xa).map(_.asJson))
      case req @ POST -> Root as user              =>
        Ok.apply(for {
          model  <- req.req.as[UserToCreate]
          userId <- service.insert(model, user.companyId).transact(xa)
        } yield userId.asJson)
      case req @ PUT -> Root / IntVar(uId) as user =>
        Ok.apply(for {
          model  <- req.req.as[UserUpdateModel]
          userId <- service.update(model, uId, user.companyId).transact(xa)
        } yield userId.asJson)
    }
  }

  def routes: HttpRoutes[F] = openRoutes <+> authService.middleware(authedRoutes)
}
