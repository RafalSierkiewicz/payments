import * as React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ILogin } from 'models';
import { useDispatch } from 'react-redux';
import { actions } from 'actions';
import { Link } from 'react-router-dom';

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
    <div className="login">
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
          act.resetForm();
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
            <Row noGutters={true}>
              <Col xs="6">
                <Button variant="primary" type="submit" className="buttons__width">
                  Login
                </Button>
              </Col>
              <Col xs="6">
                <Link to="/register">
                  <Button variant="primary" type="submit" className="buttons__width">
                    Register
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export const LoginModule = LoginModuleForm;
