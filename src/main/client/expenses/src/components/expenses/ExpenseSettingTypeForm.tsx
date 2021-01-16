import React from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { actions } from 'actions';
import * as Yup from 'yup';

const defaultExpenseTypeCreate = {
  name: '',
};
const expenseSchema = Yup.object().shape({
  name: Yup.string().required(),
});

const ExpensesTypeForm: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={defaultExpenseTypeCreate}
      validationSchema={expenseSchema}
      onSubmit={(values, act) => {
        dispatch(
          actions.expenses.createExpenseType({
            name: values.name,
          })
        );

        act.setSubmitting(false);
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="expenseTypeFormName">
              <Form.Control
                type="text"
                placeholder="Expense type name"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </Form.Group>
            <div>
              <Button size="sm" variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
});

export { ExpensesTypeForm };
