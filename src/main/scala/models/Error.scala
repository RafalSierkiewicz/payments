package models

sealed trait Error

case object ForeignKeyViolation extends Error

case object Unexpected extends Error

case class NotExists(message: String = "") extends Exception(message)
