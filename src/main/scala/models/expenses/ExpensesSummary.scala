package models.expenses

case class ExpensesSummary(usersSummary: Vector[UserSummary], total: TotalSummary)

case class UserSummary(userId: Long, summary: TotalSummary)
case class TotalSummary(payed: Double = 0, pricePartsMap: Map[ExpensePricePart, Double] = Map(), toReturn: Double = 0)
