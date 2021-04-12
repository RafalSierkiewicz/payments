package controllers.validation.models

case class RestApiErrors(errors: Map[String, Seq[String]])
