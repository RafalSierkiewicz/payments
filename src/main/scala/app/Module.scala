package app
import controllers.ExpenseController

trait Module[F[_]] {
  def expenseController: ExpenseController[F]
}
