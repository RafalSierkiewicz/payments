package controllers

import cats.effect.Sync
import org.http4s.dsl.Http4sDsl

class AuthController[F[_]: Sync] extends Http4sDsl[F] {}
