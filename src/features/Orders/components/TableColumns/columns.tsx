import React, { ReactElement } from 'react';
import { Button, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { ColumnType } from 'antd/lib/table';
import { DeleteFilled, PrinterOutlined } from '@ant-design/icons';
import {
  CustomDeclaration,
  FormData,
  Item,
  Label,
  LabelData,
  PackageInfo,
  ShipmentRate
} from '../../../../custom_types/order-page';
import { IService } from '../../../../custom_types/carrier-page';
import { OrderAddress } from '../../../../custom_types/address-page';
import { Currency } from '../../../../shared/utils/constants';

export interface RuiYunLableUrl {
  labelUrl: string;
  type: string;
}

export enum ShipmentStatus {
  PENDING = 'Pending',
  FULFILLED = 'Shipped',
  DEL_PENDING = 'Del_Pending',
  DELETED = 'Deleted'
}

export interface IAddress {
  id?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  taxNumber?: string;
  isResidential?: boolean;
}

export interface ShippingRecord extends Record<string, unknown> {
  id: string;
  orderId: string;
  accountName?: string;
  carrierAccount?: string;
  carrier?: string;
  provider?: string;
  service?: IService;
  facility?: string;
  sender: OrderAddress;
  toAddress: OrderAddress;
  return: OrderAddress;
  packageList: PackageInfo[];
  orderAmount?: number;
  orderCurrency?: Currency;
  shipmentOptions: {
    shipmentDate: string;
  };
  customDeclaration?: CustomDeclaration;
  customItems?: Item[];
  items?: Item[];
  status: string;
  trackingId?: string;
  trackingStatus?: string;
  shippingId?: string;
  rate?: ShipmentRate;
  labels?: LabelData[];
  labelUrlList?: RuiYunLableUrl[];
  invoiceUrl?: string;
  forms?: FormData[];
  manifested: boolean;
  errors?: string[];
  labelLoading: boolean;
  createdAt: string;
  updatedAt: Date;
}

const columns: ColumnType<ShippingRecord>[] = [
  {
    title: '序列号',
    dataIndex: 'index',
    key: 'index',
    render: (_: string, __: ShippingRecord, index: number): ReactElement => {
      return <div>{index + 1}</div>;
    }
  },
  {
    title: '日期',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (date: string) => {
      return (
        <Space direction="vertical" size="small">
          <div>{dayjs(date).format('YYYY/MM/DD')}</div>
          <div>{dayjs(date).format('HH:mm:ss')}</div>
        </Space>
      );
    }
  },
  {
    title: '订单号',
    dataIndex: 'orderId',
    key: 'orderId'
  },
  {
    title: '收件地址',
    dataIndex: 'toAddress',
    key: 'toAddress',
    render: (address: IAddress) => {
      return (
        <div>
          <div>
            <strong>{`${address.name}`}</strong>
          </div>
          {address.phone && <div>{address.phone}</div>}
          {address.email && <div>{address.email}</div>}
          <div>{`${address.city}, ${address.state} ${address.zip}`}</div>
        </div>
      );
    }
  },
  {
    title: '包裹信息',
    dataIndex: 'packageInfo',
    key: 'packageInfo',
    render: (text: string, record: ShippingRecord) => {
      const weight = record.packageList[0].weight;
      // console.log(`${record.orderId}-${record.packageList[0].weight.value}`);
      return (
        <div>
          <div>{`${
            typeof weight.value === 'string'
              ? weight.value
              : weight.value.toFixed(2)
          } ${weight.unitOfMeasure.toLowerCase()}`}</div>
        </div>
      );
    }
  },
  {
    title: '账号',
    dataIndex: 'accountName',
    key: 'accountName',
    render: (accountName: string, record: ShippingRecord) => {
      return (
        <div>
          <div>{accountName}</div>
          <div>{`${record.carrierAccount}`}</div>
        </div>
      );
    }
  },
  {
    title: '物流信息',
    dataIndex: 'info',
    key: 'info',
    render: (text: string, record: ShippingRecord) => {
      return (
        <div>
          <div>{record.service?.name}</div>
          {record.labels?.map((label) => (
            <div>{`${label.tracking}`}</div>
          ))}
          {record.facility && <div>{`${record.facility}`}</div>}
        </div>
      );
    }
  },
  {
    title: '邮寄费',
    dataIndex: 'rate',
    key: 'rate',
    align: 'center',
    render: (rate: ShipmentRate) => {
      if (!rate) return '-';
      return `$ ${rate.amount.toFixed(2)}`;
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      if (status === ShipmentStatus.FULFILLED) {
        return <Tag color="green">已邮寄</Tag>;
      }
      if (status === ShipmentStatus.DEL_PENDING) {
        return <Tag color="yellow">待删除</Tag>;
      }
      return <Tag color="red">已删除</Tag>;
    }
  }
];

export default columns;

// {
//   title: <FormattedMessage id="order" />,
//   key: 'order',
//   render: (text: string, record: Order): ReactElement => {
//     return <OrderColumn record={record} />;
//   }
// },
// {
//   title: <FormattedMessage id="customer" />,
//   key: 'customer',
//   render: (text: string, record: Order): ReactElement => {
//     return <CustomerColumn record={record} />;
//   }
// },
// {
//   title: <FormattedMessage id="items" />,
//   key: 'items',
//   render: (text: string, record: Order): ReactElement => {
//     return <ItemsColumn record={record} />;
//   }
// },
// {
//   title: <FormattedMessage id="packageInfo" />,
//   key: 'package-info',
//   render: (text: string, record: Order): ReactElement => {
//     return <PackageInfoColumn record={record} />;
//   }
// },
// {
//   title: <FormattedMessage id="rates" />,
//   key: 'rate',
//   render: (rate: ShipmentRate, record: Order): ReactElement => {
//     return (
//       <div className="transation_table_cell">
//         {record.rate ? `$${record.rate.amount.toFixed(2)}` : '-'}
//       </div>
//     );
//   }
// },
// {
//   title: <FormattedMessage id="tracking_status" />,
//   key: 'tracking',
//   dataIndex: 'tracking',
//   render: (tracking: string, record: Order): ReactElement => {
//     if (
//       record.status === OrderStatus.FULFILLED &&
//       record.carrier &&
//       record.trackingId &&
//       record.service
//     ) {
//       return <LabelComponent order={record} />;
//     }
//     return <div>暂无信息</div>;
//   }
// },
// {
//   title: 'Manifested',
//   key: 'manifested',
//   dataIndex: 'manifested',
//   render: (manifested: boolean, record: Order) => {
//     return manifested ? <CheckCircleTwoTone /> : '-';
//   }
// },
// {
//   title: '',
//   key: 'buttons',
//   render: (text: string, record: Order): ReactElement => {
//     return <ButtonColumn record={record} />;
//   }
// }
