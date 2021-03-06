import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { actions } from 'actions';
import * as Yup from 'yup';
import { getParts } from '../../../selectors';

const defaultPricePartCreate = {
  name: '',
  percentile: 50,
  isReturn: false,
};
const partSchema = Yup.object().shape({
  name: Yup.string().required(),
  percentile: Yup.number().required().min(0).max(100),
  isReturn: Yup.boolean().required(),
});

const ExpensesPricePartForm: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={defaultPricePartCreate}
      validationSchema={partSchema}
      onSubmit={(values, act) => {
        dispatch(
          actions.expenses.createExpensePricePart({
            name: values.name,
            percentile: values.percentile / 100,
            isReturn: values.isReturn,
          })
        );

        act.resetForm({});
        act.setStatus({ success: true });
        act.setSubmitting(false);
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="pricePartFormName">
              <Form.Control
                type="text"
                placeholder="Price part name"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="pricePartFormPercentile">
              <Form.Control
                type="number"
                placeholder="Price percentile"
                name="percentile"
                value={values.percentile}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="pricePartFormReturn">
              <Form.Check type="checkbox" label="Is return?" name="isReturn" onChange={handleChange} />
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

export { ExpensesPricePartForm };
