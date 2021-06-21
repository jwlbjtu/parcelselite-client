import { Order } from '../../custom_types/order-page';
import { Country } from './constants';

export const isOrderInternational = (order: Order): boolean => {
  const sender = order.sender;
  const recipient = order.recipient;
  const isInternational = sender.country !== recipient.country;
  return isInternational;
};

export const isOrderChinaImport = (order: Order): boolean => {
  const sender = order.sender;
  const recipient = order.recipient;
  const isInternational = sender.country !== recipient.country;
  const isChinaImport = isInternational && recipient.country === Country.CHINA;
  return isChinaImport;
};
