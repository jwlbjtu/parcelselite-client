import { Currency, DistanceUnit, WeightUnit } from '../shared/utils/constants';
import { Address } from './address-page';
import { SystemCarrier } from './carrier-page';

export interface UserInfo {
  fullName: string;
  firstName: string;
  lastName: string;
  userName: string;
  companyName?: string;
  logoImage: string;
  email: string;
  countryCode: string;
  phone: string;
  balance: number;
  currency: Currency;
  role: string;
  token_type: string;
  token: string;
  tokenExpire: number;
  isActive: boolean;
}

export interface User extends UserInfo {
  id: string;
}

export interface UserUpdateFormData {
  firstName: string;
  lastName: string;
  companyName?: string;
  countryCode: string;
  phone: string;
  password: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UserUpdateData extends UserUpdateFormData {
  id: string;
}

export interface UserResponse {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  userName: string;
  companyName: string;
  logoImage: string;
  email: string;
  countryCode: string;
  phone: string;
  balance: number;
  currency: Currency;
  role: string;
  isActive: boolean;
  token_type: string;
  token: string;
  tokenExpire: number;
  printFormat: {
    labelFormat: {
      format: string;
      type: string;
    };
    packSlipFormat: {
      format: string;
      type: string;
    };
    _id: string;
  };
  packageUnits: {
    weightUnit: WeightUnit;
    distanceUnit: DistanceUnit;
    _id: string;
  };
  clientAccounts: SystemCarrier[];
  clientAddresses?: Address[];
}

export interface UpdateUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  countryCode: string;
  phone: string;
}
