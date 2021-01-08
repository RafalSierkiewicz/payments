package models
import java.time.Instant
import java.util.Date

import io.circe.Decoder.Result
import io.circe.generic.semiauto._
import io.circe.{Decoder, Encoder, HCursor, Json}


case class Expense(id: Long, name: Option[String], price: Double, created_at: Date, month: Int)

object Expense {
  import utils.DateCodec._
  implicit val encoder: Encoder[Expense] = deriveEncoder[Expense]

  implicit val insertExpenseDecoder: Decoder[Expense] = (c: HCursor) => for {
      name <- c.get[Option[String]]("name")
      price <- c.get[Double]("price")
      month <- c.get[Int]("month")
    } yield Expense(0, name, price, Date.from(Instant.now()), month)
}
