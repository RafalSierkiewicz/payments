package app
import controllers.PaymentsController

trait Module[F[_]] {
  def paymentsController: PaymentsController[F]
}
