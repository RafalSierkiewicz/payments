package models

import io.circe.{Codec, Encoder, Json}
import io.circe.generic.semiauto._
import io.circe.syntax.EncoderOps
import org.http4s.circe.{CirceEntityDecoder, CirceEntityEncoder}
case class User(id: Long, companyId: Long, username: Option[String], email: String, password: String)
case class UserToCreate(username: Option[String], email: String, password: String)
case class UserUpdateModel(username: Option[String], password: Option[String], confirmPassword: Option[String])

object User {
  implicit val userToCreateCodec: Codec[UserToCreate]  = deriveCodec[UserToCreate]
  implicit val userUpdateModel: Codec[UserUpdateModel] = deriveCodec[UserUpdateModel]
  implicit val userCodec: Encoder[User]                = (a: User) =>
    Json.obj(
      ("id", a.id.asJson),
      ("companyId", a.companyId.asJson),
      ("username", a.username.asJson),
      ("email", a.email.asJson)
    )
}
