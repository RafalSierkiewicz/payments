package models
import java.sql.Timestamp

import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec
import utils.DateCodec._

case class ExpenseSchema(id: Long, companyId: Long, name: String, createdAt: Timestamp)
case class ExpenseSchemaToCreate(name: String)

object ExpenseSchema {
  implicit val expenseSchemaCodec: Codec[ExpenseSchema]                 = deriveCodec[ExpenseSchema]
  implicit val expenseSchemaToCreateCodec: Codec[ExpenseSchemaToCreate] = deriveCodec[ExpenseSchemaToCreate]
}
