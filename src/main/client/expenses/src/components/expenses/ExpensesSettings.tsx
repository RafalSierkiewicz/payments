import React from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { actions } from 'actions';
import * as Yup from 'yup';
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
