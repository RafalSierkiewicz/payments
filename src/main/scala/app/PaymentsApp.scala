package app

import app.config.{AppConfig, AuthConfig, DbConfig, ExpensesConfig}
import cats.Parallel
import cats.effect._
import cats.Semigroup._

import com.typesafe.config.ConfigFactory
import doobie.ExecutionContexts
import doobie.hikari.HikariTransactor
import org.flywaydb.core.Flyway
import org.flywaydb.core.api.logging.LogFactory
import org.flywaydb.core.internal.logging.slf4j.Slf4jLogCreator
import org.http4s.implicits._
import org.http4s.server.Router
import org.http4s.server.blaze.BlazeServerBuilder
import pureconfig.ConfigSource

import scala.concurrent.ExecutionContext.global
import scala.concurrent.duration.Duration
import scala.util.Try

class PaymentsApp[F[_]: Parallel: ContextShift: Timer](implicit F: ConcurrentEffect[F]) {
  private val configF: F[AppConfig] = {
    import pureconfig.generic.auto._
    F.delay({
      val db = ConfigSource.fromConfig(ConfigFactory.load(this.getClass.getClassLoader)).at("db").loadOrThrow[DbConfig]
      val auth =
        ConfigSource.fromConfig(ConfigFactory.load(this.getClass.getClassLoader)).at("auth").loadOrThrow[AuthConfig]
      val expenses =
        ConfigSource
          .fromConfig(ConfigFactory.load(this.getClass.getClassLoader))
          .at("expenses")
          .loadOrThrow[ExpensesConfig]

      AppConfig(db, auth, expenses)
    })

  }

  val run: F[ExitCode] = {
    (for {
      config <- Resource.liftF(configF).evalTap(conf => runMigrations(conf.dbConfig))
      blocker <- Blocker[F]
      transactor <- transactorResource(config.dbConfig, blocker)
      _ <- BlazeServerBuilder[F](global)
        .bindHttp(config.expenses.port, config.expenses.host)
        .withIdleTimeout(Duration.Inf)
        .withHttpApp(routes(PaymentsModule.make[F](transactor, config, blocker)).orNotFound)
        .resource
    } yield ()).use(_ => F.never)
  }

  private def transactorResource(config: DbConfig, blocker: Blocker): Resource[F, HikariTransactor[F]] = {
    for {
      ce <- ExecutionContexts.fixedThreadPool(32)
      xc <-
        HikariTransactor.newHikariTransactor(config.driver, config.jdbcUrl, config.user, config.password, ce, blocker)
    } yield xc
  }

  private def runMigrations(config: DbConfig) = {
    F.delay {
      Flyway
        .configure(getClass.getClassLoader)
        .dataSource(config.jdbcUrl, config.user, config.password)
        .load()
        .migrate()
    }
  }

  private def routes(module: Module[F]) = {
    Router(
      "api/expenses" -> module.expenseController.routes,
      "api/expenses" -> module.expenseSchemaController.routes,
      "api/expenses" -> module.expenseTypesController.routes,
      "api/users" -> module.userController.routes,
      "/" -> module.homeController.routes
    )
  }
}

object Main extends IOApp {
  LogFactory.setLogCreator(new Slf4jLogCreator)
  override def run(args: List[String]): IO[ExitCode] = {
    new PaymentsApp[IO].run
  }
}
