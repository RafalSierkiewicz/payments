package models

sealed trait Error

case object ForeignKeyViolation extends Error

case object Unexpected extends Error
