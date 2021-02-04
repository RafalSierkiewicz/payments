package models.expenses

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class ExpensePricePart(id: Long, companyId: Long, name: String, percentile: Double)
case class ExpensePricePartCreate(name: String, percentile: Double)

object ExpensePricePart {
  implicit val expensePricePartEncoder: Encoder[ExpensePricePart]             = deriveEncoder[ExpensePricePart]
  implicit val expensePricePartCreateDecoder: Decoder[ExpensePricePartCreate] = deriveDecoder[ExpensePricePartCreate]
}
