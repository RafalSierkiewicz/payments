package controllers
import cats.effect.{IO, Sync}
import dao.ExpenseDao
import io.circe.Json
import io.circe.fs2._
import io.circe.syntax._
import org.http4s.circe._
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl
import models._

class PaymentsController[F[_]: Sync](dao: ExpenseDao[F]) extends Http4sDsl[F] {

  val routes: HttpRoutes[F] = {
    HttpRoutes.of[F] {
      case GET -> Root  =>
        Ok.apply(dao.list().map(exp => exp.asJson))
      case req @ POST -> Root =>
        val inserted = req.body.through(_.through(byteStreamParser)).through(decoder[F, Expense]).through(_.evalMap(exp => dao.insert(exp)).map(_.asJson))
        Ok.apply(inserted)
    }
  }
}
