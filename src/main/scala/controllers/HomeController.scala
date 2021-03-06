package controllers

import cats.effect.{Blocker, ConcurrentEffect, ContextShift, Sync}
import org.http4s.blaze.http.HttpRequest
import org.http4s.{HttpRoutes, Request, StaticFile}

class HomeController[F[_]: Sync: ContextShift](blocker: Blocker) extends BaseController[F] {

  private[this] def static(file: String, request: Request[F]) =
    StaticFile.fromResource(s"/prod/$file", blocker, Some(request)).getOrElseF(NotFound())

  def routes = HttpRoutes.of[F] {
    case request @ GET -> Root             =>
      static("index.html", request)
    case request @ GET -> "static" /: path =>
      static(s"static/${path.toList.mkString("/")}", request)
    case request @ GET -> Root / _         =>
      static("index.html", request)
  }
}
