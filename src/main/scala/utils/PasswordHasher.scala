package utils

import org.mindrot.jbcrypt.BCrypt

import scala.util.Try

object PasswordHasher {
  def hashPassword(password: String): Option[String] = Try(BCrypt.hashpw(password, BCrypt.gensalt)).toOption

  def checkPassword(plain: String, hashed: String): Boolean = BCrypt.checkpw(plain, hashed)

}
