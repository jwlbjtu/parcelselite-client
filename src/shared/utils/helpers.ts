import { IService } from '../../custom_types/carrier-page';
import { Order } from '../../custom_types/order-page';
import {
  CARRIERS,
  Country,
  DHL_ECOMMERCE_INTL_SERVICES,
  DHL_ECOMMERCE_SERVICES,
  UPS_INTL_SERVICES,
  UPS_SERVICES,
  USPS_INTL_SERVICES,
  USPS_SERVICES
} from './constants';

export const isOrderInternational = (order: Order): boolean => {
  const sender = order.sender;
  const toAddress = order.toAddress;
  const isInternational = sender.country !== toAddress.country;
  return isInternational;
};

export const isOrderChinaImport = (order: Order): boolean => {
  const sender = order.sender;
  const toAddress = order.toAddress;
  const isInternational = sender.country !== toAddress.country;
  const isChinaImport = isInternational && toAddress.country === Country.CHINA;
  return isChinaImport;
};

export const getCarrierServices = (
  carrier: string,
  isInternational: boolean
): IService[] => {
  switch (carrier) {
    case CARRIERS.DHL_ECOM:
      return isInternational
        ? DHL_ECOMMERCE_INTL_SERVICES
        : DHL_ECOMMERCE_SERVICES;
    case CARRIERS.UPS:
      return isInternational ? UPS_INTL_SERVICES : UPS_SERVICES;
    case CARRIERS.USPS:
      return isInternational ? USPS_INTL_SERVICES : USPS_SERVICES;
    default:
      return [];
  }
};
