package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._


case class ExpenseType(id: Long, companyId: Long, name: String)
case class ExpenseTypeToCreate(name: String)

object ExpenseType {
    implicit val expenseTypeToCreateDecoder: Decoder[ExpenseTypeToCreate] = deriveDecoder[ExpenseTypeToCreate]
    implicit val expenseTypesEncoder: Encoder[ExpenseType] = deriveCodec[ExpenseType]
}