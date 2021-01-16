import * as React from 'react';
import { JWT_KEY } from 'utils';
import { Redirect } from 'react-router-dom';

function withAuth<T>(WrappedComponent: React.ComponentType<T>) {
  return class ComponentWithSelection extends React.Component<T> {
    render() {
      const hasToken = !!localStorage.getItem(JWT_KEY);

      return hasToken ? <WrappedComponent {...this.props} /> : <Redirect to="/login" />;
    }
  };
}

export { withAuth };
