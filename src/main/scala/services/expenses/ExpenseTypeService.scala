package services.expenses

import dao.ExpenseTypeDao
import models.expenses.{ExpenseType, ExpenseTypeToCreate}

class ExpenseTypeService(expenseTypeDao: ExpenseTypeDao) {

  def listTypesByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseType] =
    expenseTypeDao.listByCompany(companyId)

  def insertType(companyId: Long, expenseType: ExpenseTypeToCreate): doobie.ConnectionIO[Long] =
    expenseTypeDao.insert(companyId, expenseType)

  def deleteType(id: Long, companyId: Long): doobie.ConnectionIO[Int] =
    expenseTypeDao.delete(id, companyId)

  def getByName(companyId: Long, name: String): doobie.ConnectionIO[Option[ExpenseType]] =
    expenseTypeDao.getByName(companyId, name)
}
