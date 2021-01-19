package services

import cats.effect.Bracket
import dao.{ExpenseDao, ExpenseSchemaDao, ExpenseTypeDao}
import doobie.util.transactor.Transactor
import models.{
  Expense,
  ExpenseSchemaToCreate,
  ExpenseToCreate,
  ExpenseTypeToCreate,
  ForeignKeyViolation,
  NotExists,
  Unexpected
}
import doobie.implicits._
import doobie.postgres._

class ExpenseService[F[_]](expenseDao: ExpenseDao, expenseTypeDao: ExpenseTypeDao, expenseSchemaDao: ExpenseSchemaDao)(
  implicit ev: Bracket[F, Throwable]
) {
  def findExpensesBySchemaId(schemaId: Long, companyId: Long): fs2.Stream[doobie.ConnectionIO, Expense] = {
    fs2.Stream.eval(expenseSchemaDao.getById(schemaId, companyId)).flatMap {
      case Some(_) => expenseDao.getBySchemaId(schemaId)
      case None    =>
        fs2.Stream
          .raiseError[doobie.ConnectionIO](NotExists(s"Schema ${schemaId} does not belong to company $companyId"))
    }
  }

  def getExpenseSchemaSummary(schemaId: Long, companyId: Long): fs2.Stream[doobie.ConnectionIO, Expense] = {
    for {
      _        <- fs2.Stream.eval(expenseSchemaDao.getById(schemaId, companyId))
      expenses <- expenseDao.getBySchemaId(schemaId)
    } yield expenses
  }

  def insert(expense: ExpenseToCreate): doobie.ConnectionIO[Either[models.Error, Long]] = {
    expenseDao
      .insert(expense)
      .attemptSqlState
      .map(_.left.map {
        case sqlstate.class23.FOREIGN_KEY_VIOLATION => ForeignKeyViolation
        case _                                      => Unexpected
      })
  }

  def listTypesByCompany(companyId: Long) = {
    expenseTypeDao.listByCompany(companyId)
  }

  def insertType(companyId: Long, expenseType: ExpenseTypeToCreate) = {
    expenseTypeDao.insert(companyId, expenseType)
  }

  def insertSchema(companyId: Long, expenseType: ExpenseSchemaToCreate) = {
    expenseSchemaDao.insert(companyId, expenseType)
  }

  def listSchemasByCompany(companyId: Long) = {
    expenseSchemaDao.getCompanySchemas(companyId)
  }
}
