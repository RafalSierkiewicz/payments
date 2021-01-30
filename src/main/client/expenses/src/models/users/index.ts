interface IUsersStore {
  users: IUser[];
}

interface IUser {
  id: number;
  companyId: number;
  username?: string;
  email: string;
}

interface IUserCreate {
  username?: string;
  email: string;
  password: string;
}

interface IUserUpdate {
  id: number;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export type { IUsersStore, IUser, IUserCreate, IUserUpdate };
