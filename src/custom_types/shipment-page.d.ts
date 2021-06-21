import { Currency } from '../shared/utils/constants';
import { Address } from './address-page';
import { Label } from './order-page';

export interface Shipment extends Record<string, unknown> {
  id: string;
  carrier: string;
  service: string;
  tags: string[];
  rate: ShipmentRate;
  sender: Address;
  recipient: Address;
  orderInfo?: string;
  createdAt: string;
  tracking: string;
  trackingStatus?: string;
  labelStatus: LabelStatus;
  label: Label;
}

export interface ShipmentRate {
  amount: number;
  currency: Currency;
}

export interface LabelStatus {
  status: string;
  label?: Label;
  message?: string;
}

export interface TrackingInfo {
  carrier: string;
  tracking: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  event: string;
}
