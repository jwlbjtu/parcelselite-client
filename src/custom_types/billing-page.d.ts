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

export interface CreateBillingData {
  total: number;
  deposit: number;
  addFund?: boolean;
  description: string;
}

export interface Billing extends CreateBillingData {
  id: string;
  userRef: string;
  account?: string;
  balance: number;
  currency: string;
  details?: {
    shippingCost?: {
      amount: number;
      components?: {
        description: string;
        amount: number;
      }[];
    };
    fee?: {
      amount: number;
      type: string;
      base: string;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserBillingRecordsSearchQuery {
  startDate: string;
  endDate: string;
  status?: string;
  orderId?: string;
  channel?: string;
}
