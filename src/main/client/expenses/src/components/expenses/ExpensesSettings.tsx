import React from 'react';
import { Container } from 'react-bootstrap';
import { ExpensesTypeForm } from './forms/ExpenseSettingTypeForm';
import { ExpensesSchemaForm } from './forms/ExpenseSettingSchemaForm';

const ExpensesSettings: React.FC = React.memo(() => {
  return (
    <Container>
      <ExpensesTypeForm />
      <ExpensesSchemaForm />
    </Container>
  );
});

export { ExpensesSettings };
