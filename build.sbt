import Dependencies._

name := "payments"

version := "0.1"

scalaVersion := "2.13.4"

libraryDependencies ++= Seq(
  //http4s
  "ch.qos.logback"            % "logback-classic"        % "1.2.3",
  "org.http4s"               %% "http4s-dsl"             % http4sVersion,
  "org.http4s"               %% "http4s-blaze-server"    % http4sVersion,
  "org.http4s"               %% "http4s-blaze-client"    % http4sVersion,
  "org.http4s"               %% "http4s-circe"           % http4sVersion,
  //circe
  "io.circe"                 %% "circe-generic"          % circeVersion,
  "io.chrisdavenport"        %% "log4cats-slf4j"         % "1.1.1",
  "io.circe"                 %% "circe-fs2"              % "0.13.0",
  //mcwire
  "com.softwaremill.macwire" %% "macros"                 % "2.3.3" % Provided,
  //pureconfig
  "com.github.pureconfig"    %% "pureconfig-cats-effect" % pureConfig,
  "com.github.pureconfig"    %% "pureconfig-enumeratum"  % pureConfig,
  "com.github.pureconfig"    %% "pureconfig-generic"     % pureConfig,
  //dobbie
  "org.tpolecat"             %% "doobie-core"            % doobie,
  "org.tpolecat"             %% "doobie-postgres"        % doobie,
  "org.tpolecat"             %% "doobie-hikari"          % doobie,
  "org.tpolecat"             %% "doobie-scalatest"       % doobie  % Test,
  "org.flywaydb"              % "flyway-core"            % "7.3.2",
  "org.postgresql"            % "postgresql"             % "42.2.9",
  "com.pauldijou"            %% "jwt-circe"              % "4.2.0",
  "org.mindrot"               % "jbcrypt"                % "0.3m"
)
