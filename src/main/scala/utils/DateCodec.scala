package utils
import java.sql.Timestamp

import io.circe.{Codec, Decoder, Encoder}

object DateCodec {
  implicit val dateCodec: Codec[Timestamp] = {
    Codec.from(Decoder.decodeLong.map(new Timestamp(_)), Encoder.encodeLong.contramap[Timestamp](_.getTime))
  }
}
