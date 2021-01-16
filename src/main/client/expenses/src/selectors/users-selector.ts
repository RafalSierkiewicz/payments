import { IAppState } from 'models';

const getUsers = (state: IAppState) => state.usersStore.users;
export { getUsers };
