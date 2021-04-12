package app
import controllers.expenses._
import controllers.{HomeController, UserController}

trait Module[F[_]] {
  def expenseController: ExpenseController[F]
  def userController: UserController[F]
  def homeController: HomeController[F]
  def expenseSchemaController: ExpenseSchemaController[F]
  def expenseTypesController: ExpenseTypesController[F]
}
