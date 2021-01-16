import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { actions } from 'actions';

const registerSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
  company: Yup.string().required(),
  username: Yup.string(),
});

const defaultRegisterLogin = {
  company: '',
  email: '',
  password: '',
  username: '',
};

const RegisterModuleForm = () => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={defaultRegisterLogin}
      validationSchema={registerSchema}
      onSubmit={(values, act) => {
        dispatch(
          actions.auth.register({
            user: {
              email: values.email,
              password: values.password,
              username: values.username,
            },
            company: {
              name: values.company,
            },
          })
        );
        act.setSubmitting(false);
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="registerFormCompany">
            <Form.Label>Company name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter company name"
              name="company"
              value={values.company}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="registerFormUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={values.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="registerFormEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="registerFormPassword">
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

export const RegisterModule = RegisterModuleForm;
