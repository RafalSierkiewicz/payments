package models.expenses

import java.sql.Timestamp

import io.circe.generic.semiauto._
import io.circe.{Codec, Decoder}
import utils.DateCodec._
case class Expense(
  id: Long,
  schemaId: Long,
  typeId: Long,
  userId: Long,
  name: Option[String],
  price: Double,
  createdAt: Timestamp
)
case class ExpenseToCreate(
  typeId: Long,
  userId: Long,
  schemaId: Long,
  name: Option[String],
  price: Double,
  createdAt: Option[Timestamp]
)

object Expense {

  implicit val expenseCodec: Codec[Expense]                   = deriveCodec[Expense]
  implicit val expenseToCreateCodec: Decoder[ExpenseToCreate] = deriveDecoder[ExpenseToCreate]
}
