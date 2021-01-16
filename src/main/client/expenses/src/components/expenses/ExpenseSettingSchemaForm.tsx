import React from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { actions } from 'actions';
import * as Yup from 'yup';

const defaultExpenseSchemaCreate = {
  name: '',
};
const expenseSchemaSchema = Yup.object().shape({
  name: Yup.string().required(),
});

const ExpensesSchemaForm: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={defaultExpenseSchemaCreate}
      validationSchema={expenseSchemaSchema}
      onSubmit={(values, act) => {
        dispatch(
          actions.expenses.createExpenseSchema({
            name: values.name,
          })
        );

        act.setSubmitting(false);
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="expenseSchemaFormName">
              <Form.Control
                type="text"
                placeholder="Expense schema name"
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

export { ExpensesSchemaForm };
