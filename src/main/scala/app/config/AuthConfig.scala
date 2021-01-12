package app.config

import scala.concurrent.duration.FiniteDuration

case class AuthConfig(secret: String, duration: FiniteDuration)
