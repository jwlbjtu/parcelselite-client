export interface ClientAccount {
  id: Types.ObjectId;
  accountName: string;
  accountId: string;
  carrier: string;
  connectedAccount: string;
  services: IService[];
  facilities: string[];
  carrierRef: string;
  userRef: string;
  note?: string;
  isActive: boolean;
}

export interface IFacility {
  pickup: string;
  facility: string;
}

export interface IService {
  key: string;
  id?: string;
  name: string;
}
