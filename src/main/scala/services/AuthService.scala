package services

import java.time.Instant

import app.config.AuthConfig
import cats.Monad
import cats.data.{Kleisli, OptionT}
import cats.effect.Sync
import cats.implicits._
import doobie.implicits._
import doobie.util.transactor.Transactor
import io.chrisdavenport.log4cats.slf4j.Slf4jLogger
import io.circe.Json
import io.circe.generic.semiauto._
import io.circe.parser._
import io.circe.syntax._
import models.User
import org.http4s.server.AuthMiddleware
import org.http4s.util.CaseInsensitiveString
import org.http4s.{AuthedRoutes, Request, Response, Status}
import pdi.jwt.{JwtAlgorithm, JwtCirce, JwtClaim}
import utils.PasswordHasher

case class AuthContext(userId: Long, companyId: Long)
sealed trait UserError                       extends Exception
case class PasswordNotMatch(message: String) extends UserError

class AuthService[F[_]: Monad: Sync](userService: UserService[F], config: AuthConfig, xa: Transactor[F]) {
  implicit def unsafeLogger = Slf4jLogger.getLogger[F]

  private val authContextEncoder                                     = deriveEncoder[AuthContext]
  private val authContextDecoder                                     = deriveDecoder[AuthContext]
  private val authUser: Kleisli[F, Request[F], Either[String, User]] =
    Kleisli(req => {
      val header = req.headers.get(CaseInsensitiveString("Authorization"))
      header.flatMap(authHeader => getTokenFromString(authHeader.value)).toRight("Token is missing").joinRight match {
        case Right(ctx)  => userService.getById(ctx.userId).transact(xa).map(_.toRight("User not found"))
        case Left(value) => Either.left[String, User](value).pure[F]
      }
    })
  private val onAuthFailure: AuthedRoutes[String, F]                 = Kleisli(req => {
    req.req match {
      case _ => OptionT.pure[F](Response[F](status = Status.Unauthorized))
    }
  })

  def middleware: AuthMiddleware[F, User] = AuthMiddleware(authUser, onAuthFailure)

  def verifyLogin(email: String, password: String): F[Option[String]] = {
    userService
      .getByEmail(email)
      .transact(xa)
      .map(
        _.filter(user => PasswordHasher.checkPassword(password, user.password))
          .map(user => generateToken(user.id, user.companyId))
      )
  }

  private def generateToken(userId: Long, companyId: Long): String = {
    val claim =
      JwtClaim(
        content = AuthContext(userId, companyId).asJson(authContextEncoder).noSpaces,
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
          parse(token.content)
            .getOrElse(Json.Null)
            .as[AuthContext](authContextDecoder)
            .left
            .map(_ => "Cannot parse token content")
      )
      .left
      .map(_ => "Token is not valid")
      .joinRight
  }

  private def verifyTokenName(name: Option[String]) = {
    val tokenName = "Bearer"
    name.contains(tokenName)
  }

  private def getTokenFromString(token: String): Option[Either[String, AuthContext]] = {
    if (verifyTokenName(token.split(" ").headOption)) {
      Some(token.split(" ").lastOption.map(verifyToken).toRight("Wrong token provided").joinRight)
    } else {
      None
    }

  }
}
