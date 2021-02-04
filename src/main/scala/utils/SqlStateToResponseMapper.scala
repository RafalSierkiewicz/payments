package utils

import cats.Applicative
import cats.effect.Sync
import doobie.SqlState
import doobie.postgres.sqlstate
import org.http4s.Status.{Conflict, InternalServerError, UnprocessableEntity}
import org.http4s.{Response, Status}
import cats.implicits._
object SqlStateToResponseMapper {

  implicit class RichEither[F[_]: Applicative](val e: Either[SqlState, F[Response[F]]]) {
    def sqlStateToResponse: F[Response[F]] = e.left
      .map {
        case sqlstate.class23.UNIQUE_VIOLATION      => Conflict
        case sqlstate.class23.FOREIGN_KEY_VIOLATION => UnprocessableEntity
        case state                                  =>
          println(state)
          InternalServerError
      }
      .left
      .map(status => new Response[F](status).pure[F])
      .merge
  }
}
