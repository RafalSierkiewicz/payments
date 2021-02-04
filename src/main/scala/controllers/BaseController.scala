package controllers
import cats.effect.Sync
import cats.{Applicative, Monad, MonadError}
import io.circe.Decoder
import io.circe.fs2.{byteStreamParser, decoder}
import org.http4s.dsl.Http4sDsl
import org.http4s.{EntityDecoder, Request, Response}
import cats.implicits._
trait BaseController[F[_]] extends Http4sDsl[F] {

  def decodeRequest[A](request: Request[F])(implicit dec: Decoder[A], F: Sync[F]): fs2.Stream[F, A] = {
    request.body
      .through(_.through(byteStreamParser))
      .through(decoder[F, A])
  }

  def parseBody[A](request: Request[F])(
    f: A => F[Response[F]]
  )(implicit dec: EntityDecoder[F, A], err: MonadError[F, Throwable], F: Applicative[F]): F[Response[F]] = {
    request.as[A].flatMap(body => f(body)).handleErrorWith(err => BadRequest(err.getMessage))
  }
}
