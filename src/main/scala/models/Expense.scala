package models
import java.sql.Timestamp

import io.circe.{Codec, Decoder, Encoder}
import io.circe.generic.semiauto._
import utils.DateCodec._
case class Expense(id: Long, schemaId: Long, name: Option[String], price: Double, createdAt: Timestamp)
case class ExpenseToCreate(name: Option[String], price: Double, createdAt: Option[Timestamp])

object Expense {

  implicit val expenseCodec: Codec[Expense]                   = deriveCodec[Expense]
  implicit val expenseToCreateCodec: Decoder[ExpenseToCreate] = deriveDecoder[ExpenseToCreate]
}
