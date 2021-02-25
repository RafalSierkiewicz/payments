import java.sql.Timestamp
import java.time.Instant

import models.expenses.{Expense, ExpensePricePart, ExpensesSummary, TotalSummary, UserSummary}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers._
import utils.ExpenseCalculator
class ExpenseCalculatorTest extends AnyFlatSpec with should.Matchers {
  val (own, half, full, returned, quarter) = (
    createPricePart(0, "own", id = 0),
    createPricePart(0.5, "half"),
    createPricePart(1, "full", id = 2),
    createPricePart(1, "returned", id = 3, isReturn = true),
    createPricePart(0.25, "quarter", id = 4)
  )
  val pricePartsList                       = Vector(own, half, full, returned, quarter)

  it should "correctly calculate summary for two users without returns with only half price part" in {
    val expensesList = Vector(
      createExpense(100),
      createExpense(200),
      createExpense(300),
      createExpense(300, userId = 2),
      createExpense(1200, userId = 2)
    )

    /*
  TOTAL = 2100
  EQUAL PER U = 1050
  U1R = 300
  U26 = 750
  TO RETURN TOTAL = 1050
  U1 = 600 - (2100 * 0,5) = -450
  U2 = 1500 - (2100 * 0,5) = 450
     */

    val result         = ExpenseCalculator.calculate(expensesList, pricePartsList)
    val expectedResult =
      ExpensesSummary(
        Vector(
          UserSummary(1, TotalSummary(600, Map(half.name -> 600), 300 - 750)),
          UserSummary(2, TotalSummary(1500, Map(half.name -> 1500), 750 - 300))
        ),
        TotalSummary(2100, Map(half.name -> 2100))
      )

    result shouldBe expectedResult
  }

  it should "correctly calculate summary for 4 users without returns with only half price part" in {
    val expensesList = Vector(
      createExpense(100, pricePart = 4),
      createExpense(200, pricePart = 4),
      createExpense(300, pricePart = 4),
      createExpense(400, pricePart = 4, userId = 2),
      createExpense(1200, pricePart = 4, userId = 2),
      createExpense(600, pricePart = 4, userId = 3),
      createExpense(400, pricePart = 4, userId = 3),
      createExpense(900, pricePart = 4, userId = 4),
      createExpense(700, pricePart = 4, userId = 4)
    )

    val result         = ExpenseCalculator.calculate(expensesList, pricePartsList)
    /*
      TOTAL = 4800
      EQUAL PER U = 1200
      U1 = (600 - 4800*0,25) = -600
      U2 = (1600 - 4800*0,25) = 400
      U3 = (1000 - 4800*0,25) = -200
      U4 = U2 = 400
     */
    val expectedResult =
      ExpensesSummary(
        Vector(
          UserSummary(1, TotalSummary(600, Map(quarter.name -> 600), -600)),
          UserSummary(2, TotalSummary(1600, Map(quarter.name -> 1600), 400)),
          UserSummary(3, TotalSummary(1000, Map(quarter.name -> 1000), -200)),
          UserSummary(4, TotalSummary(1600, Map(quarter.name -> 1600), 400))
        ),
        TotalSummary(4800, Map(quarter.name -> 4800))
      )

    result.usersSummary should contain theSameElementsAs expectedResult.usersSummary
    result.total.pricePartsMap should contain theSameElementsAs expectedResult.total.pricePartsMap
  }

  it should "correctly calculate summary for two users with returns with only half.name price part" in {
    val expensesList = Vector(
      createExpense(100),
      createExpense(200),
      createExpense(300),
      createExpense(50, pricePart = 3),
      createExpense(300, userId = 2),
      createExpense(1200, userId = 2),
      createExpense(90, userId = 2, pricePart = 3)
    )
    /*
      TOTAL = 2100
      EQUAL PER U = 1050
      U1 = (600 - 2100*0,5) = -450
      U2 = (1500 - 2100*0,5) = 450
     */

    val result         = ExpenseCalculator.calculate(expensesList, pricePartsList)
    val expectedResult =
      ExpensesSummary(
        Vector(
          UserSummary(1, TotalSummary(650, Map(half.name -> 600, returned.name -> 50), -490)),
          UserSummary(2, TotalSummary(1590, Map(half.name -> 1500, returned.name -> 90), 490))
        ),
        TotalSummary(2240, Map(half.name -> 2100, returned.name -> 140))
      )
    result.usersSummary should contain theSameElementsAs expectedResult.usersSummary
    result.total shouldBe expectedResult.total
  }

  it should "correctly calculate summary for two users with returns with different price parts" in {
    val expensesList = Vector(
      createExpense(100, pricePart = 0),
      createExpense(300),
      createExpense(200, pricePart = 2),
      createExpense(50, pricePart = 3),
      createExpense(300, userId = 2, pricePart = 0),
      createExpense(100, userId = 2, pricePart = 2),
      createExpense(1200, userId = 2)
    )

    val result = ExpenseCalculator.calculate(expensesList, pricePartsList)

    /*
      TOTAL = 1500 + 300 = 1800
      EQUAL PER U = 750
      U1 = (300 - 1500*0,5) + (200 - 100) + 50 = -450 + 100 + 50 = -300 /-350
      U2 = (1200 - 1500*0,5) + (100 - 200) - 50 = 450 - 100 - 50 = 300 /350
     */
    val expectedResult =
      ExpensesSummary(
        Vector(
          UserSummary(
            1,
            TotalSummary(650, Map(half.name -> 300, own.name -> 100, full.name -> 200, returned.name -> 50), -300)
          ),
          UserSummary(2, TotalSummary(1600, Map(half.name -> 1200, own.name -> 300, full.name -> 100), 300))
        ),
        TotalSummary(2250, Map(half.name -> 1500, own.name -> 400, full.name -> 300, returned.name -> 50), 0)
      )

    result.usersSummary should contain theSameElementsAs expectedResult.usersSummary
    result.total.pricePartsMap should contain theSameElementsAs expectedResult.total.pricePartsMap
  }

  private def createExpense(price: Double, userId: Long = 1, pricePart: Long = 1) = {
    Expense(1, 1, 1, userId, pricePart, Some("name"), price, Timestamp.from(Instant.now()))
  }

  private def createPricePart(percentile: Double, name: String, id: Long = 1, isReturn: Boolean = false) = {
    ExpensePricePart(id, 1, name, percentile)
  }
}
