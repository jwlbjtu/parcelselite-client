import { ReactElement } from 'react';
import { OrderAddress } from './address-page';
import {
  Country,
  Currency,
  DistenceUnit,
  OrderStatus,
  WeightUnit
} from '../shared/utils/constants';

export interface CreateOrderData {
  sender: OrderAddress;
  recipient: OrderAddress;
  customDeclaration?: CustomDeclaration;
}

export interface Order extends Record<string, unknown> {
  id: string;
  orderId?: string;
  orderDate: string;
  company: string;
  sender: OrderAddress;
  recipient: OrderAddress;
  return: OrderAddress;
  packageInfo?: PackageInfo;
  morePackages?: PackageInfo[];
  orderAmount?: number;
  orderCurrency?: Currency;
  shipmentOptions: {
    shipmentDate: string;
  };
  orderStatus: OrderStatus;
  isHidden: boolean;
  customDeclaration?: CustomDeclaration;
  items?: Item[];
  customItems?: Item[];
  labels?: Label[];
  useItemWeight: boolean;
  // UI Options
  selectedRate?: Rate;
  rates?: Rate[];
  errors?: string[];
  rateLoading?: boolean;
}

export interface CustomDeclaration {
  typeOfContent: string;
  incoterm: string;
  exporterRef?: string;
  importerRef?: string;
  invoice?: string;
  nonDeliveryHandling: string;
  license?: string;
  certificate?: string;
  signingPerson: string;
  taxIdType?: string;
  eelpfc?: string;
  b13a?: string;
  notes?: string;
}

export interface Item {
  id?: string;
  itemTitle: string;
  quantity: number;
  itemWeight: number;
  totalWeight: number;
  itemWeightUnit: WeightUnit;
  itemValue: number;
  totalValue: number;
  itemValueCurrency: Currency;
  country?: Country;
  sku?: string;
  hsTariffNumber?: string;
}

export interface ItemUpdateData extends Item {
  orderId: string;
  isCustom: boolean;
}

export interface PackageInfo {
  packageType: string;
  dimentions: Dimentions;
  weight: Weight;
}

export interface Dimentions {
  length: number;
  width: number;
  height: number;
  distenceUnit: DistenceUnit;
}

export interface Weight {
  value: number;
  weightUnit: WeightUnit;
}

export interface Rate {
  carrier: string;
  serviceId: string;
  service: string;
  account?: string;
  rate?: number;
  currency?: Currency;
  eta?: string;
  isTest: boolean;
  thirdparty?: boolean;
  thirdpartyAcctId?: string;
  platformCarrierId: string;
}

export interface Label {
  id: string;
  carrier: string;
  serviceId: string;
  service: string;
  tracking: string;
  createdAt: string;
  label: string;
  moreLabels: string[];
  format: string;
  encodeType: string;
  isTest: boolean;
  shipmentDate: Date;
  manifested: boolean;
}

export interface OrderTabelColumnProps {
  record: Order;
}

export interface CsvUploadError {
  description: string;
  fields: string[];
}

export interface CsvTableRecord {
  header: string;
  option: number;
  data: string;
}
