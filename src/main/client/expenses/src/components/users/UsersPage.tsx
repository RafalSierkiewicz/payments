import * as React from 'react';
import { UsersList } from './UsersList';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { actions } from '../../actions';
import { useDispatch } from 'react-redux';
import { Button, Col, Form } from 'react-bootstrap';

const defaultUserValues = {
  username: '',
  email: '',
  password: '',
};
const userCreateSchema = Yup.object().shape({
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
});

const UsersPage: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Formik
        initialValues={defaultUserValues}
        validationSchema={userCreateSchema}
        onSubmit={(values, act) => {
          dispatch(
            actions.users.createUser({
              username: values.username,
              email: values.email,
              password: values.password,
            })
          );
        }}
      >
        {({ handleSubmit, handleChange, values }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} controlId="userFormUsername">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="userFormEmail">
                <Form.Control
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="userFormPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
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
      <UsersList />
    </>
  );
};

export { UsersPage };
