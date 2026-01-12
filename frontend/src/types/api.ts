export interface ResponseModel {
  status: string;
  version: string;
}

export interface Transaction {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}
