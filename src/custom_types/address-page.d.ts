import { Country } from '../shared/utils/constants';

export interface OrderAddress extends Record<string, any> {
  id?: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  country: Country;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip?: string;
}

export interface AddressCreateData
  extends Record<string, string | undefined | boolean> {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  country: Country;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip?: string;
  isDefaultSender: boolean;
  isDefaultReturn: boolean;
}

export interface Address extends AddressCreateData {
  id: string;
}
