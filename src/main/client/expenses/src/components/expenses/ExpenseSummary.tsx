import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSchemaSummary, getUsers } from 'selectors';
import { map, find } from 'lodash';
import { ITotalSummary, IUser, IUserSummary } from 'models';
export const ExpenseSummary: React.FC = React.memo(() => {
  const users = useSelector(getUsers);
  const summary = useSelector(getSchemaSummary);
  const headers = Object.keys(summary.total.pricePartsMap);
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Users</th>
          <th>Sum</th>
          {map(Array.from(headers), (name: string) => {
            return <th>{name}</th>;
          })}
          <th>To return</th>
        </tr>
      </thead>
      <tbody>
        {map(summary.usersSummary, (sum: IUserSummary) => {
          return (
            <tr>
              <td>{find(users, (u: IUser) => u.id === sum.userId)!!.email}</td>
              <td>{sum.summary.payed}</td>
              {map(Array.from(Object.values(sum.summary.pricePartsMap)), (value: number) => {
                return <td>{value}</td>;
              })}
              <td>{sum.summary.toReturn}</td>
            </tr>
          );
        })}
        <tr>
          <td>Total</td>
          <th>{summary.total.payed}</th>
          {map(Array.from(Object.values(summary.total.pricePartsMap)), (value: number) => {
            return <td>{value}</td>;
          })}
          <td>{summary.total.toReturn}</td>
        </tr>
      </tbody>
    </Table>
  );
});
