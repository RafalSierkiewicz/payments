interface ICompany {
  id: number;
  name: string;
  createdAt: number;
}

interface ICompanyCreate {
  name: string;
}

export type { ICompany, ICompanyCreate };
