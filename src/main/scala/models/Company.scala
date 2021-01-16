package models

import java.sql.Timestamp

import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
import utils.DateCodec._
case class Company(id: Long, name: String, createdAt: Timestamp)

case class CompanyToCreate(name: String)

object Company {
  implicit val companyCodec: Codec[Company]                 = deriveCodec[Company]
  implicit val companyToCreateCodec: Codec[CompanyToCreate] = deriveCodec[CompanyToCreate]
}
