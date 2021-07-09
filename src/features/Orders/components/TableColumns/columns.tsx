import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { Order, ShipmentRate } from '../../../../custom_types/order-page';
import OrderColumn from './OrderColumn';
import CustomerColumn from './CustomerColumn';
import ItemsColumn from './ItemsColumn';

import './columns.css';
import PackageInfoColumn from './PackageInfoColumn';
import ButtonColumn from './ButtonColumn';
import LabelComponent from './LabelComponent';

const columns = [
  {
    title: <FormattedMessage id="order" />,
    key: 'order',
    render: (text: string, record: Order): ReactElement => {
      return <OrderColumn record={record} />;
    }
  },
  {
    title: <FormattedMessage id="customer" />,
    key: 'customer',
    render: (text: string, record: Order): ReactElement => {
      return <CustomerColumn record={record} />;
    }
  },
  {
    title: <FormattedMessage id="items" />,
    key: 'items',
    render: (text: string, record: Order): ReactElement => {
      return <ItemsColumn record={record} />;
    }
  },
  {
    title: <FormattedMessage id="packageInfo" />,
    key: 'package-info',
    render: (text: string, record: Order): ReactElement => {
      return <PackageInfoColumn record={record} />;
    }
  },
  {
    title: <FormattedMessage id="rates" />,
    key: 'rate',
    render: (rate: ShipmentRate, record: Order): ReactElement => {
      return (
        <div className="transation_table_cell">
          {record.rate ? `$${record.rate.amount.toFixed(2)}` : '-'}
        </div>
      );
    }
  },
  {
    title: <FormattedMessage id="tracking_status" />,
    key: 'tracking',
    dataIndex: 'tracking',
    render: (tracking: string, record: Order): ReactElement => {
      if (record.carrier && record.trackingId && record.service) {
        return <LabelComponent order={record} />;
      }
      return <div>暂无信息</div>;
    }
  },
  {
    title: 'Manifested',
    key: 'manifested',
    dataIndex: 'manifested',
    render: (manifested: boolean, record: Order) => {
      return manifested ? <CheckCircleTwoTone /> : '-';
    }
  },
  {
    title: '',
    key: 'buttons',
    render: (text: string, record: Order): ReactElement => {
      return <ButtonColumn record={record} />;
    }
  }
];

export default columns;
