package dao

import doobie.implicits._
import doobie.util.fragment.Fragment
trait AppDao {
  val updateFields: Fragment
  lazy val selectFields: Fragment = Fragment.const(" id,") ++ updateFields
  val tableName: Fragment

  def selectQ[A](query: Fragment)(implicit read: doobie.Read[A]): doobie.Query0[A] = {
    selectQ[A](Some(query))
  }

  def selectQ[A](maybeQuery: Option[Fragment] = None)(implicit read: doobie.Read[A]): doobie.Query0[A] = {
    (fr"select " ++ selectFields ++ fr" from " ++ tableName ++ maybeQuery.getOrElse(Fragment.empty)).query[A]
  }

  def insertQ(values: Fragment): doobie.Update0 = {
    (fr"insert into " ++ tableName ++ fr" ( " ++ updateFields ++ fr" ) values " ++ values).update
  }

  def deleteQ(values: Fragment): doobie.Update0 = {
    (fr"delete from " ++ tableName ++ values).update
  }

  def deleteByIdQ(id: Long): doobie.Update0 = {
    (fr"delete from " ++ tableName ++ fr"where id=$id").update
  }
}
