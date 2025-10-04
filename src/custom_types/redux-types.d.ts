import { Address, ShippingRecord } from './address-page';
import { Label, Order } from './order-page';
import { ClientAccount } from './carrier-page';
import { User } from './profile-page';
import { Billing, Transaction } from './billing-page';
import { Shipment } from './shipment-page';
import { DistanceUnit, WeightUnit } from '../shared/utils/constants';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export interface RootState {
  i18n: I18nState;
  currentUser: CurrentUserState;
  billing: BillingState;
  orders: OrdersState;
  shipments: ShipmentState;
  settings: SettingsState;
  addresses: AddressesState;
  carriers: CarriersState;
  rate: RateCheckState;
}

export interface I18nState {
  language: string;
}

export interface CurrentUserState {
  currentUser: User | undefined;
  profilePageLoading: boolean;
  loginLoading: boolean;
  loginError: boolean;
  resetEmailSent: boolean;
  registerError: string | undefined;
  resetError: string | undefined;
  resetLoading: boolean;
  userTimeout: NodeJS.Timeout | undefined;
}

export interface BillingState {
  transactions: Billing[];
  transactionTableLoading: boolean;
}

export interface OrdersState {
  orders: ShippingRecord[];
  filters: Record<string, string>;
  loading: boolean;
  redirectOrderId: string | undefined;
  showItemsModal: boolean;
  deletingItem: boolean;
  savingPackInfo: boolean;
  showOrderAddressModal: boolean;
  showSelectAddressModal: boolean;
  purchasing: boolean;
  purchasingOrderId: string | undefined;
  redirectOrders: boolean;
  showCsvModal: boolean;
  csvData: { name: string; list: string[][] } | undefined;
  showCustomModal: boolean;
  orderFilter: Record<string, string | undefined>;
}

export interface ShipmentState {
  shipments: Order[];
  manifests: Manifest[];
  loading: boolean;
  manifestLoading: boolean;
  showTrackingModal: boolean;
  trackingInfo: TrackingInfo;
}

export interface Manifest extends Record<string, unknown> {
  id: string;
  carrier: string;
  timestamp: Date;
  status?: string;
  manifests: ManifestData[];
  manifestErrors: string[];
}

export interface ManifestData {
  manifestData: string;
  encodeType: string;
  format: string;
}

export interface SettingsState {
  labels: LabelsPageData;
  packages: PackagesPageData;
  loading: boolean;
}

export interface LabelsPageData {
  id: string;
  labelSettings: LabelSettings;
  packSlipSettings: LabelSettings;
}

export interface LabelSettings {
  format: string;
  type: string;
}

export interface PackagesPageData {
  packagesUnits: PackagesUnitSettings;
}

export interface PackagesUnitSettings {
  id: string;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
}

export interface AddressesState {
  default: Address | undefined;
  addresses: Address[];
  showModal: boolean;
  deleting: boolean;
  loading: boolean;
  pageLoading: boolean;
}

export interface CarriersState {
  systemAccounts: ClientAccount[];
  loading: boolean;
  carrierModalLoading: boolean;
  showCarrierModal: boolean;
}

export interface RateCheckState {
  loading: boolean;
  rates: RateInfo;
}

export interface RateInfo {
  rate: number;
  currency: string;
  fee: number;
  baseRate: number;
  details?: any;
}

export interface UserShippingRateRequest {
  channel: string;
  toAddress: OrderAddress;
  packageList: ApiPackage[];
}

export interface ApiPackage {
  weight: number; // 重量 KG
  length?: number; // 长 cm
  width?: number; // 宽 cm
  height?: number; // 高 cm
  count: number; // 件数
  lineItems: ApiLineItem[];
}
