import React from 'react';
import { Container } from 'react-bootstrap';
import { ExpensesTypeForm } from './ExpenseSettingTypeForm';
import { ExpensesSchemaForm } from './ExpenseSettingSchemaForm';

const ExpensesSettings: React.FC = React.memo(() => {
  return (
    <Container>
      <ExpensesTypeForm />
      <ExpensesSchemaForm />
    </Container>
  );
});

export { ExpensesSettings };
