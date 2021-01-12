package models

import java.sql.Timestamp

case class Company(id: Long, name: String, createdAt: Timestamp)

case class CompanyToCreate(name: String)
