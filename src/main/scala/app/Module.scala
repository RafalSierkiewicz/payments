package app
import controllers.{ExpenseController, HomeController, UserController}

trait Module[F[_]] {
  def expenseController: ExpenseController[F]
  def userController: UserController[F]
  def homeController: HomeController[F]
}
