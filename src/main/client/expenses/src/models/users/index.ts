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

export type { IUsersStore, IUser, IUserCreate };
