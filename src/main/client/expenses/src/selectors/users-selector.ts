import { IAppState } from 'models';
import { find } from 'lodash';
const getUsers = (state: IAppState) => state.usersStore.users;
const getUserById = (state: IAppState, id: number) => find(state.usersStore.users, ['id', id]);
export { getUsers, getUserById };
