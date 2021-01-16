import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { ILogin } from 'models';
import { useDispatch } from 'react-redux';
import { actions } from 'actions';

const loginSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

const defaultLoginValues: ILogin = {
  email: '',
  password: '',
};

const LoginModuleForm = () => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={defaultLoginValues}
      validationSchema={loginSchema}
      onSubmit={(values, act) => {
        dispatch(
          actions.auth.login({
            email: values.email,
            password: values.password,
          })
        );
        act.setSubmitting(false);
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export const LoginModule = LoginModuleForm;
