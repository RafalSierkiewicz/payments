package app
import controllers.{ExpenseController, UserController}

trait Module[F[_]] {
  def expenseController: ExpenseController[F]
  def userController: UserController[F]
}
