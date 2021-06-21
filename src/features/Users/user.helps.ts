import { Address } from '../../custom_types/address-page';
import { ClientAccount } from '../../custom_types/carrier-page';
import { User, UserResponse } from '../../custom_types/profile-page';
import {
  LabelsPageData,
  PackagesUnitSettings
} from '../../custom_types/redux-types';

const convertUserResponse = (data: UserResponse) => {
  const user: User = {
    id: data.id,
    fullName: data.fullName,
    firstName: data.firstName,
    lastName: data.lastName,
    userName: data.userName,
    logoImage: data.logoImage,
    companyName: data.companyName,
    email: data.email,
    countryCode: data.countryCode,
    phone: data.phone,
    balance: data.balance,
    currency: data.currency,
    role: data.role,
    token: data.token,
    token_type: data.token_type,
    tokenExpire: data.tokenExpire,
    isActive: data.isActive
  };

  const printFormat = data.printFormat;
  const labelpageData: LabelsPageData = {
    id: printFormat._id,
    labelSettings: printFormat.labelFormat,
    packSlipSettings: printFormat.packSlipFormat
  };

  const packageUnits = data.packageUnits;
  const packagesUnitSettings: PackagesUnitSettings = {
    id: packageUnits._id,
    weightUnit: packageUnits.weightUnit,
    distanceUnit: packageUnits.distanceUnit
  };

  const carrierSettings: ClientAccount[] = data.clientAccounts || [];
  const addresses: Address[] = data.clientAddresses || [];

  return {
    user,
    labelpageData,
    packagesUnitSettings,
    carrierSettings,
    addresses
  };
};

export default convertUserResponse;
