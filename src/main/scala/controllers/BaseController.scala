package controllers
import io.circe.fs2._

import cats.effect.Sync
import io.circe.Decoder
import io.circe.fs2.{byteStreamParser, decoder}
import org.http4s.Request

trait BaseController {

  def decodeRequest[F[_], A](request: Request[F])(implicit dec: Decoder[A], F: Sync[F]): fs2.Stream[F, A] = {
    request.body
      .through(_.through(byteStreamParser))
      .through(decoder[F, A])
  }
}
