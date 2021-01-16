import { ICompanyCreate, IUserCreate } from 'models';

interface IAuthStore {}

interface ILogin {
  email: string;
  password: string;
}

interface IRegister {
  company: ICompanyCreate;
  user: IUserCreate;
}

export type { IAuthStore, ILogin, IRegister };
