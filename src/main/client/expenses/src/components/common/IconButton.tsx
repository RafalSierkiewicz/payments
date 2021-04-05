import * as React from 'react';
import { IconContext } from 'react-icons';
import { ImBin2, IoSettingsOutline, TiTickOutline } from 'react-icons/all';
import { actions } from '../../actions';

interface IButtonPros {
  onClick?: (e: any) => void;
  icon?: React.ReactNode;
  iconColor: string;
}

export const IconButton: React.FC<IButtonPros> = ({ icon, iconColor, onClick }) => {
  return (
    <div onClick={onClick} role="button">
      <IconContext.Provider value={{ color: iconColor, size: '20px' }}>{icon}</IconContext.Provider>
    </div>
  );
};

interface IRemoveButton {
  onClick?: (e: any) => void;
}

export const RemoveButton: React.FC<IRemoveButton> = ({ onClick }) => {
  return <IconButton icon={<ImBin2 />} iconColor="#dc3545" onClick={onClick} />;
};

interface IFormSubmitButton {
  onClick?: (e: any) => void;
}

export const FormSubmitButton: React.FC<IFormSubmitButton> = ({ onClick }) => {
  return <IconButton icon={<TiTickOutline />} iconColor="#007bff" onClick={onClick} />;
};
