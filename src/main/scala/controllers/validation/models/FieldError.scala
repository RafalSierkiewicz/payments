package controllers.validation.models

import cats.data.NonEmptyList

case class FieldError(fieldName: String, message: String)
object FieldError {
  type ValidationResult = Option[NonEmptyList[FieldError]]
}
