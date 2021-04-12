package services.expenses

import dao.{ExpenseDao, ExpenseSchemaDao}
import models.expenses.{ExpenseSchema, ExpenseSchemaToCreate}

class ExpenseSchemaService(expenseDao: ExpenseDao, expenseSchemaDao: ExpenseSchemaDao) {

  def insertSchema(companyId: Long, expenseSchema: ExpenseSchemaToCreate): doobie.ConnectionIO[Long] =
    expenseSchemaDao.insert(companyId, expenseSchema)

  def getByName(companyId: Long, name: String): doobie.ConnectionIO[Option[ExpenseSchema]] =
    expenseSchemaDao.getByName(companyId, name)

  def deleteSchema(id: Long, companyId: Long): doobie.ConnectionIO[Int] =
    for {
      _  <- expenseDao.deleteBySchemaId(id)
      id <- expenseSchemaDao.deleteById(id, companyId)
    } yield id

  def listSchemasByCompany(companyId: Long): fs2.Stream[doobie.ConnectionIO, ExpenseSchema] =
    expenseSchemaDao.getCompanySchemas(companyId)
}
