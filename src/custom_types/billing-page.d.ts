import { Currency } from '../shared/utils/constants';

export interface Transaction {
  id: string;
  userRef?: string;
  description: string;
  account?: string;
  total: number;
  balance: number;
  currency: Currency;
  addFund?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  invoice?: string;
}
