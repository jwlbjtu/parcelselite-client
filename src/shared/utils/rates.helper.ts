import { Rate } from '../../custom_types/order-page';
import {
  CARRIERS,
  USPS_INTL_SERVICE_IDS_LIST,
  USPS_SERVICES
} from './constants';

export const findCheapestRate = (rates: Rate[]): Rate => {
  let targetRate = rates[0];
  rates.forEach((ele) => {
    if (ele.rate && targetRate.rate) {
      if (ele.rate < targetRate.rate) {
        targetRate = ele;
      } else if (
        ele.rate === targetRate.rate &&
        ele.eta &&
        targetRate.eta &&
        ele.eta < targetRate.eta
      ) {
        targetRate = ele;
      }
    }
  });
  return targetRate;
};

export const matchRate = (
  rate1: Rate | undefined,
  rate2: Rate | undefined
): boolean => {
  if (!rate2 || !rate1) return false;
  return (
    rate1.carrier === rate2.carrier &&
    rate1.account === rate2.account &&
    rate1.service === rate2.service
  );
};

export const findFastestRate = (
  rates: Rate[],
  duplicateRate: Rate | undefined
): Rate => {
  let targetRate = rates[0];
  rates.forEach((ele) => {
    if (ele.eta && targetRate.eta && !matchRate(ele, duplicateRate)) {
      if (ele.eta < targetRate.eta) {
        targetRate = ele;
      } else if (
        ele.eta === targetRate.eta &&
        ele.rate &&
        targetRate.rate &&
        ele.rate < targetRate.rate
      ) {
        targetRate = ele;
      }
    }
  });
  return targetRate;
};

export const getDisplayTracking = (
  carrier: string,
  tracking: string,
  service: string
): string => {
  if (
    carrier === CARRIERS.USPS &&
    service &&
    service.length > 0 &&
    USPS_SERVICES.findIndex((ele) => ele.name === service) >= 0
  ) {
    return tracking.substring(8);
  }
  return tracking;
};
