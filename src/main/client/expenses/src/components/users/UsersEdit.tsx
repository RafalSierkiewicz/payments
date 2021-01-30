import * as React from 'react';
import { actions } from '../../actions';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getUserById } from 'selectors';
import { IAppState, IUser } from 'models';
import { Dispatch } from 'redux';
import { undefOrValue } from '../../utils/model';

const expenseSchema = Yup.object().shape({
  name: Yup.string(),
  password: Yup.string(),
  confirmPassword: Yup.string(),
});

interface UserIdRouteProps {
  id: string;
}

interface UserEditProps extends RouteComponentProps<UserIdRouteProps> {
  dispatch: Dispatch;
  user?: IUser;
  id: number;
}

const UsersEditBase: React.FC<UserEditProps> = ({ dispatch, user, id }) => {
  const defaultUserEditSchema = {
    username: user!!.username || '',
    password: '',
    confirmPassword: '',
  };
  return (
    <Formik
      key="user-edit-form"
      initialValues={defaultUserEditSchema}
      validationSchema={expenseSchema}
      onSubmit={(values, act) => {
        dispatch(
          actions.users.editUser({
            id,
            username: undefOrValue(values.username),
            password: undefOrValue(values.password),
            confirmPassword: undefOrValue(values.confirmPassword),
          })
        );

        act.resetForm({});
        act.setStatus({ success: true });
        act.setSubmitting(false);
      }}
    >
      {({ handleSubmit, handleChange, values }) => (
        <Form onSubmit={handleSubmit} id="user-edit-form" key="user-edit-form">
          <Form.Group controlId="userEditFormName">
            <Form.Control
              type="text"
              placeholder="Name"
              name="username"
              value={values.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="userEditFormPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="userEditFormConfirmPassword">
            <Form.Control
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>
          <div>
            <Button size="sm" variant="primary" type="submit" id="editSubmit">
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const mapStateToProps = (state: IAppState, props: UserEditProps) => {
  return {
    user: getUserById(state, Number(props.match.params['id'])),
    id: Number(props.match.params['id']),
  };
};

export const UsersEdit = connect(mapStateToProps)(UsersEditBase);
