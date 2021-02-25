package models.expenses

import io.circe.{Codec, Encoder, Json}
import io.circe.generic.semiauto._
import ExpensePricePart._
import io.circe.syntax.EncoderOps

case class ExpensesSummary(usersSummary: Vector[UserSummary], total: TotalSummary)

case class UserSummary(userId: Long, summary: TotalSummary)
case class TotalSummary(payed: Double = 0, pricePartsMap: Map[String, Double] = Map(), toReturn: Double = 0)

object ExpensesSummary {
  private implicit val totalSummaryCodec: Encoder[TotalSummary] = deriveEncoder[TotalSummary]
  private implicit val userSummaryCodec: Encoder[UserSummary]   = deriveEncoder[UserSummary]
  implicit val expensesSummaryCodec: Encoder[ExpensesSummary]   = deriveEncoder[ExpensesSummary]
}
