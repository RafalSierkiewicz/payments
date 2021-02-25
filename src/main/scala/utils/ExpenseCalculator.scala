package utils

import models.expenses.{Expense, ExpensePricePart, ExpensesSummary, TotalSummary, UserSummary}
case class Summary(payed: Double = 0, pricePartsMap: Map[ExpensePricePart, Double] = Map(), toReturn: Double = 0)

object ExpenseCalculator {
  def calculate(expenses: Vector[Expense], parts: Vector[ExpensePricePart]): ExpensesSummary = {
    val userToSummary = expenses
      .groupBy(_.userId)
      .view
      .mapValues(_.foldLeft(Summary()) { case (summary, expense) =>
        val part             = parts.find(_.id == expense.pricePart).get
        val summaryPartPrice =
          summary.pricePartsMap.find(_._1 == part).getOrElse[(ExpensePricePart, Double)]((part, 0.toDouble))
        summary.copy(
          payed = summary.payed + expense.price,
          pricePartsMap = summary.pricePartsMap + (summaryPartPrice._1 -> (summaryPartPrice._2 + expense.price))
        )
      })
      .toMap
    val totalSummary  = userToSummary.values
      .flatMap(_.pricePartsMap.toVector)
      .groupMap(_._1)(_._2)
      .view
      .mapValues(_.sum)
      .toMap
    val userToReturn  = calculateToReturn(userToSummary, totalSummary)
    ExpensesSummary(
      userToReturn.map(el => UserSummary(el._1, summaryToTotal(el._2))).toVector,
      TotalSummary(totalSummary.values.sum, totalSummary.view.map(el => el._1.name -> el._2).toMap)
    )

  }

  private def summaryToTotal(summary: Summary): TotalSummary = {
    TotalSummary(summary.payed, summary.pricePartsMap.view.map(el => el._1.name -> el._2).toMap, summary.toReturn)
  }

  private def calculateToReturn(
    map: Map[Long, Summary],
    partsPrices: Map[ExpensePricePart, Double]
  ): Map[Long, Summary] = {
    map.map { case (uId, total) =>
      val toReturn = partsPrices.filter(_._1.percentile != 0).map { case (part, t) =>
        val sum = total.pricePartsMap.getOrElse[Double](part, 0)
        if (Math.abs(part.percentile - (1.0 / map.size)) <= 0.1) {
          sum - (t * Math.abs(part.percentile))
        } else {
          sum - ((t * Math.abs(part.percentile)) - sum)
        }
      }
      uId -> total.copy(toReturn = toReturn.sum)
    }
  }
}
