package controllers.validation

import cats.effect.Sync
import cats.implicits._
import controllers.validation.models.{FieldError, RestApiErrors}
import io.circe.Json
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import org.http4s.Response
import org.http4s.Status.BadRequest
import org.http4s.circe._

trait Validator[F[_]] {
  implicit val sync: Sync[F]

  private implicit val restApiErrorsEncoder = deriveEncoder[RestApiErrors]

  def withValidation[T](model: T)(f: => F[Response[F]])(implicit constraints: ApiConstraints[T]): F[Response[F]] = {
    validate(model, constraints).flatMap {
      case Some(errors) =>
        Response[F](status = BadRequest).withEntity[Json](errors.asJson).pure[F]
      case None         => f
    }
  }

  private def validate[T](obj: T, constraints: ApiConstraints[T]): F[Option[RestApiErrors]] = {
    constraints.constraints
      .map(_.apply(obj))
      .sequence
      .map(_.flatten)
      .map(
        errors =>
          if (errors.isEmpty) {
            None
          } else {
            Some(RestApiErrors(errors.groupBy(_.fieldName).map { case (field, e) =>
              (field, e.map(_.message))
            }))
          }
      )
  }

  case class ApiConstraints[T](constraints: ApiConstraintBase[T]*)

  class ApiConstraintBase[T](val apply: T => F[Seq[FieldError]])

  case class ApiConstraintAsync[T](field: String, error: String, predicate: T => F[Boolean])
      extends ApiConstraintBase[T]((t: T) => predicate(t).map(p => if (p) Seq.empty else Seq(FieldError(field, error))))

  case class ApiConstraint[T](field: String, error: String, predicate: T => Boolean)
      extends ApiConstraintBase[T](t => (if (predicate(t)) Seq.empty else Seq(FieldError(field, error))).pure[F])
}
