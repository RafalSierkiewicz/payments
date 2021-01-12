package models
import java.sql.Timestamp
import java.util.Date

case class ExpenseSchema(id: Long, userId: Long, name: String, createdAt: Timestamp)
case class ExpenseSchemaToCreate(name: String, createdAt: Timestamp)
