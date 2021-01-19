package validation

import cats.data.{NonEmptyList, ValidatedNec}
import cats.syntax.option._
import validation.Validator.{FieldValidator, ValidationResult}
object Validator {
  type ValidationResult = Option[NonEmptyList[FieldError]]
  trait Validator[T] {
    def validate(target: T): ValidationResult
  }

  trait FieldValidator[T] {
    def validate(field: T, fieldName: String): ValidationResult
  }
}

case object NotEmpty extends FieldValidator[String] {
  override def validate(field: String, fieldName: String): ValidationResult =
    if (field.isEmpty) NonEmptyList.of(FieldError(fieldName, "Must not be empty")).some else None
}
