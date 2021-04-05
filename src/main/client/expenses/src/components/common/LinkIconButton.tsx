import * as React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from './IconButton';

interface IButtonPros {
  to: string;
  icon: React.ReactNode;
  iconColor: string;
}

export const LinkIconButton: React.FC<IButtonPros> = ({ to, icon, iconColor }) => {
  return (
    <Link to={to}>
      <IconButton iconColor={iconColor} icon={icon} />{' '}
    </Link>
  );
};
