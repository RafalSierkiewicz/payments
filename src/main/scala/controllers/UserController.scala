package controllers

import cats.Monad
import cats.effect.Sync
import cats.implicits._
import doobie.implicits._
import doobie.util.transactor.Transactor
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.circe.Decoder
import io.circe.generic.semiauto._
import io.circe.syntax._
import models.User._
import models.{CompanyToCreate, User, UserToCreate, UserUpdateModel}
import models.Company._
import org.http4s.circe._
import org.http4s.{AuthedRoutes, EntityDecoder, EntityEncoder, HttpRoutes}
import services.{AuthService, CompanyService, UserService}

case class LoginForm(email: String, password: String)
case class UserWithCompanyForm(user: UserToCreate, company: CompanyToCreate)

class UserController[F[_]: Sync: Monad](
  service: UserService[F],
  companyService: CompanyService[F],
  authService: AuthService[F],
  xa: Transactor[F]
) extends BaseController[F] {
  implicit def unsafeLogger[F[_]: Sync]                                                        = Slf4jLogger.getLogger[F]
  private implicit val loginFormDecoder: Decoder[LoginForm]                                    = deriveDecoder[LoginForm]
  private implicit val loginFormEntityDecoder: EntityDecoder[F, LoginForm]                     = jsonOf[F, LoginForm]
  private implicit val userWithCompanyFormDecoder: Decoder[UserWithCompanyForm]                = deriveDecoder[UserWithCompanyForm]
  private implicit val userWithCompanyFormEntityDecoder: EntityDecoder[F, UserWithCompanyForm] =
    jsonOf[F, UserWithCompanyForm]
  private implicit val userEntityEncoder: EntityEncoder[F, User]                               = CirceEntityEncoder.circeEntityEncoder[F, User]
  private implicit val userToCreateEncoder: EntityDecoder[F, UserToCreate]                     = jsonOf[F, UserToCreate]
  private implicit val userUpdateModelEncoder: EntityDecoder[F, UserUpdateModel]               = jsonOf[F, UserUpdateModel]

  private val openRoutes: HttpRoutes[F] = {
    HttpRoutes.of {
      case req @ POST -> Root / "login" =>
        parseBody[LoginForm](req) { loginForm =>
          authService
            .verifyLogin(loginForm.email, loginForm.password)
            .flatMap {
              case Some(token) => Ok(token)
              case None        => Forbidden()
            }
        }

      case req @ POST -> Root / "register" =>
        parseBody[UserWithCompanyForm](req) { userWithCompanyForm =>
          companyService
            .createWithUser(userWithCompanyForm.company, userWithCompanyForm.user)
            .flatMap(id => Ok.apply(id.asJson))
        }
    }
  }
  private val authedRoutes: AuthedRoutes[User, F] = {
    AuthedRoutes.of {
      case GET -> Root / IntVar(_) as user =>
        Ok(user.asJson)

      case GET -> Root as user =>
        Ok(service.getCompanyUsers(user.companyId).transact(xa).map(_.asJson))

      case req @ POST -> Root as user =>
        parseBody[UserToCreate](req.req) { model =>
          service.insert(model, user.companyId).transact(xa).flatMap {
            case Some(id) => Ok(id.asJson)
            case None     => UnprocessableEntity("Password contains unprocessable chars")
          }
        }

      case req @ PUT -> Root / IntVar(uId) as user =>
        parseBody[UserUpdateModel](req.req) { model =>
          service.update(model, uId, user.companyId).transact(xa).flatMap {
            case Some(id) => Ok(id.asJson)
            case None     => NotFound()
          }
        }
    }
  }

  def routes: HttpRoutes[F] = openRoutes <+> authService.middleware(authedRoutes)
}
