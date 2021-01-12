package models

import io.circe.Codec
import io.circe.generic.semiauto._
case class User(id: Long, companyId: Long, username: Option[String], email: String, password: String)
case class UserToCreate(username: Option[String], email: String, password: String)

object User {
  implicit val userToCreateCodec: Codec[UserToCreate] = deriveCodec[UserToCreate]
}
