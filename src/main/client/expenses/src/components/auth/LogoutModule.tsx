import * as React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from 'actions';
import { JWT_KEY } from 'utils';

const LogoutModule = React.memo(() => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    localStorage.removeItem(JWT_KEY);
    dispatch(actions.auth.logout());
  });

  return <div>Logout</div>;
});
export { LogoutModule };
