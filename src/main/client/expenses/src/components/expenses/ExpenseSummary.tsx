import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getSchemaSummary, getUsers } from 'selectors';
import { map, find, sortBy, forEach } from 'lodash';
import { ITotalSummary, IUser, IUserSummary, SimpleMap } from 'models';
export const ExpenseSummary: React.FC = React.memo(() => {
  const users = useSelector(getUsers);
  const summary = useSelector(getSchemaSummary);
  const headers = sortBy(Object.keys(summary.total.pricePartsMap), (str: string) => str);
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Users</th>
          <th>Sum</th>
          {map(headers, (name: string) => {
            return <th>{name}</th>;
          })}
          <th>To return</th>
        </tr>
      </thead>
      <tbody>
        {map(summary.usersSummary, (sum: IUserSummary) => {
          return (
            <tr>
              <td>{find(users, (u: IUser) => u.id === sum.userId)!!.username}</td>
              <td>{sum.summary.payed}</td>
              {map(headers, (partName: string) => {
                return <td>{sum.summary.pricePartsMap[partName] || 0}</td>;
              })}
              <td>{sum.summary.toReturn}</td>
            </tr>
          );
        })}
        <tr>
          <td>Total</td>
          <th>{summary.total.payed}</th>
          {map(headers, (value: string) => {
            return <td>{summary.total.pricePartsMap[value]}</td>;
          })}
          <td>{summary.total.toReturn}</td>
        </tr>
      </tbody>
    </Table>
  );
});
