package services

import java.time.Instant

import app.config.AuthConfig
import cats.Monad
import cats.data.{Kleisli, OptionT}
import cats.effect.Sync
import cats.implicits._
import io.circe.Json
import io.circe.generic.semiauto._
import io.circe.parser._
import io.circe.syntax._
import models.{User, UserToCreate}
import org.http4s.server.AuthMiddleware
import org.http4s.{AuthedRoutes, Request, Response, Status}
import org.http4s.util.CaseInsensitiveString
import org.mindrot.jbcrypt.BCrypt
import pdi.jwt.{JwtAlgorithm, JwtCirce, JwtClaim}

import scala.util.Try

case class AuthContext(userId: Long, companyId: Long)
sealed trait UserError                       extends Exception
case class PasswordNotMatch(message: String) extends UserError
class AuthService[F[_]: Monad: Sync](userService: UserService[F], config: AuthConfig) {
  val middleware: AuthMiddleware[F, User]                            = AuthMiddleware(authUser, onAuthFailure)
  private val encoder                                                = deriveEncoder[AuthContext]
  private val decoder                                                = deriveDecoder[AuthContext]
  private val authUser: Kleisli[F, Request[F], Either[String, User]] =
    Kleisli(req => {
      val header = req.headers.get(CaseInsensitiveString("Authorization"))
      header.map(authHeader => getTokenFromString(authHeader.value)).toRight("Token is missing").joinRight match {
        case Right(ctx)  => userService.getById(ctx.userId).map(_.toRight("User not found"))
        case Left(value) => Either.left[String, User](value).pure[F]
      }
    })
  private val onAuthFailure: AuthedRoutes[String, F]                 = Kleisli(req => {
    req.req match {
      case _ => OptionT.pure[F](Response[F](status = Status.Unauthorized))
    }
  })

  def verifyLogin(email: String, password: String): F[Option[String]] = {
    userService
      .getByEmail(email)
      .map(
        _.filter(user => user.password.some == hashPassword(password))
          .map(user => generateToken(user.id, user.companyId))
      )
  }

  def hashPassword(password: String): Option[String] = Try(BCrypt.hashpw(password, BCrypt.gensalt)).toOption

  private def generateToken(userId: Long, companyId: Long): String = {
    val claim =
      JwtClaim(
        content = AuthContext(userId, companyId).asJson(encoder).noSpaces,
        issuedAt = Some(Instant.now().getEpochSecond),
        expiration = Some(Instant.now().getEpochSecond + config.duration.toSeconds)
      )
    JwtCirce.encode(claim, config.secret, JwtAlgorithm.HS256)
  }

  private def verifyToken(token: String): Either[String, AuthContext] = {
    JwtCirce
      .decode(token, config.secret, Seq(JwtAlgorithm.HS256))
      .toEither
      .map(
        token =>
          parse(token.content).getOrElse(Json.Null).as[AuthContext](decoder).left.map(_ => "Cannot parse token content")
      )
      .left
      .map(_ => "Token is not valid")
      .joinRight

  }

  private def getTokenFromString(token: String): Either[String, AuthContext] = {
    token.split(" ").lastOption.map(verifyToken).toRight("Wrong token provided").joinRight
  }
}
