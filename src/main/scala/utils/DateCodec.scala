package utils
import java.util.Date

import io.circe.{Codec, Decoder, Encoder}


object DateCodec {
  implicit val dateCodec: Codec[Date] = {
    Codec.from(
      Decoder.decodeLong.map(new Date(_)),
      Encoder.encodeLong.contramap[Date](_.getTime)
    )
  }
}
