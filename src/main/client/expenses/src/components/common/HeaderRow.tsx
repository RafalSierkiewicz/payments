import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface IHeaderRowProps extends RouteComponentProps<any> {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

export const HeaderRow: React.FC<IHeaderRowProps> = ({ component }) => {
  return <div>{component}</div>;
};
