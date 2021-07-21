import { CARRIERS, Country, Store } from './constants';
import parcelseliteIcon from '../../assets/logo.png';
import amazonIcon from '../../assets/images/stores/amazon-icon.svg';
import ebayIcon from '../../assets/images/stores/ebay-icon.svg';
import shopifyIcon from '../../assets/images/stores/shopify-icon.svg';
import chinaIcon from '../../assets/images/countries/china.svg';
import usIcon from '../../assets/images/countries/united-states.svg';
import dhlIcon from '../../assets/images/carriers/dhl-icon.svg';
import uspsIcon from '../../assets/images/carriers/usps-icon.svg';
import upsIcon from '../../assets/images/carriers/ups-icon.svg';
import fedexIcon from '../../assets/images/carriers/fedex-icon.png';
import dhlLogo from '../../assets/images/carriers/dhl-ecommerce-logo.svg';
import uspsLogo from '../../assets/images/carriers/usps-logo.svg';
import upsLogo from '../../assets/images/carriers/ups-logo.svg';
import fedexLogo from '../../assets/images/carriers/fedex-logo.svg';

export const getStoreIcon = (company: string | undefined): string => {
  switch (company?.toLowerCase()) {
    case Store.PARCELSELITE:
      return parcelseliteIcon;
    case Store.AMAZON:
      return amazonIcon;
    case Store.EBAY:
      return ebayIcon;
    case Store.SHOPIFY:
      return shopifyIcon;
    default:
      return '';
  }
};

export const getCountryIcon = (country: Country): string => {
  switch (country) {
    case Country.USA:
      return usIcon;
    case Country.CHINA:
      return chinaIcon;
    default:
      return '';
  }
};

export const getCarrierIcon = (carrier: string): string => {
  switch (carrier) {
    case CARRIERS.DHL_ECOM:
      return dhlIcon;
    case CARRIERS.USPS:
      return uspsIcon;
    case CARRIERS.UPS:
      return upsIcon;
    case CARRIERS.FEDEX:
      return fedexIcon;
    default:
      return '';
  }
};

export const getCarrierLogo = (carrier: string): string => {
  switch (carrier) {
    case CARRIERS.DHL_ECOM:
      return dhlLogo;
    case CARRIERS.USPS:
      return uspsLogo;
    case CARRIERS.UPS:
      return upsLogo;
    case CARRIERS.FEDEX:
      return fedexLogo;
    default:
      return '';
  }
};
