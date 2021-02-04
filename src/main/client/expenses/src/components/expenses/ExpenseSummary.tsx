import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getUsers } from 'selectors';
import { map } from 'lodash';
import { IUser } from 'models';
export const ExpenseSummary: React.FC = React.memo(() => {
  const users = useSelector(getUsers);
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Users</th>
          <th>Payed</th>
          <th>To return</th>
        </tr>
      </thead>
      <tbody>
        {map(users, (user: IUser) => {
          return (
            <tr>
              <td>{user.username}</td>
              <td>0</td>
              <td>0</td>
            </tr>
          );
        })}
        <tr>
          <td>Summary</td>
          <td>Total</td>
          <td>-</td>
        </tr>
      </tbody>
    </Table>
  );
});
