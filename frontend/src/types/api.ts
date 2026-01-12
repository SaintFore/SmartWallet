export interface ResponseModel {
  status: string;
  version: string;
}

export interface TransactionModel {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}
