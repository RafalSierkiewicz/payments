import React, { createRef } from 'react';
import { Formik } from 'formik';
import { actions } from '../../../actions';
import * as _ from 'lodash';
import { IExpense, IExpensePart, IExpenseType, IUser } from '../../../models';
import { Button, Col, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { isMobile } from 'react-device-detect';

const expenseSchema = Yup.object().shape({
  name: Yup.string(),
  price: Yup.number().required().positive().min(1),
  typeName: Yup.string().required(),
  user: Yup.string().required(),
  part: Yup.string().required(),
});

interface IExpensesFormProps {
  schemaId: number;
  types: IExpenseType[];
  users: IUser[];
  priceParts: IExpensePart[];
}

export const ExpensesForm: React.FC<IExpensesFormProps> = ({ users, priceParts, types, schemaId }) => {
  const dispatch = useDispatch();
  const inputRef = createRef<HTMLInputElement>();

  const defaultExpenseCreate = {
    name: '',
    price: 0.0,
    typeName: _.head(_.map(types, (t: IExpenseType) => t.name)) || '',
    user: _.head(_.map(users, (u: IUser) => u.username || u.email)) || '',
    part: _.head(_.map(priceParts, (u: IExpensePart) => u.name)) || '',
  };
  return (
    <Formik
      initialValues={defaultExpenseCreate}
      validationSchema={expenseSchema}
      onSubmit={(values, act) => {
        dispatch(
          actions.expenses.createExpense({
            name: values.name,
            price: values.price,
            typeId: _.find(types, (t: IExpenseType) => t.name === values.typeName)!!.id,
            userId: _.find(users, (t: IUser) => t.username === values.user || t.email === values.user)!!.id,
            schemaId: schemaId,
            pricePart: _.find(priceParts, (p: IExpensePart) => p.name === values.part)!!.id,
          })
        );
        act.resetForm({
          values: { typeName: values.typeName, name: '', price: 0, user: values.user, part: values.part },
        });
        act.setStatus({ success: true });
        act.setSubmitting(false);
        inputRef.current!.focus();
      }}
    >
      {({ handleSubmit, handleChange, values, errors }) => (
        <Form onSubmit={handleSubmit}>
          <div className={isMobile ? '' : 'form-row'}>
            <Form.Group as={Col} controlId="expenseFormPrice">
              <Form.Control
                ref={inputRef}
                type="number"
                placeholder="Enter price"
                name="price"
                value={values.price}
                onChange={handleChange}
                isInvalid={!!errors.price}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="expenseFormType">
              <Form.Control
                as="select"
                placeholder="Select type"
                name="typeName"
                value={values.typeName}
                onChange={handleChange}
                isInvalid={!!errors.typeName}
              >
                {_.map(types, (type: IExpenseType) => {
                  return <option id={type.id.toString()}>{type.name}</option>;
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="expenseFormUser">
              <Form.Control
                as="select"
                placeholder="Select user"
                name="user"
                value={values.user}
                onChange={handleChange}
              >
                {_.map(users, (user: IUser) => {
                  return <option id={user.id.toString()}>{user.username || user.email}</option>;
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="expenseFormUser">
              <Form.Control
                as="select"
                placeholder="Select part"
                name="part"
                value={values.part}
                onChange={handleChange}
              >
                {_.map(priceParts, (p: IExpensePart) => {
                  return <option id={p.id.toString()}>{p.name}</option>;
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="expenseFormName">
              <Form.Control
                type="text"
                placeholder="Enter expense name"
                name="name"
                value={values.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
            </Form.Group>
            <Col xs={1} lg={1}>
              <Button size="sm" variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </div>
        </Form>
      )}
    </Formik>
  );
};
