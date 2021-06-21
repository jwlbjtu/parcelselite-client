import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Order } from '../../../../custom_types/order-page';
import OrderColumn from './OrderColumn';
import CustomerColumn from './CustomerColumn';
import ItemsColumn from './ItemsColumn';

import './columns.css';
import PackageInfoColumn from './PackageInfoColumn';
import RatesColumn from './RatesColumn/RatesColumn';
import ButtonColumn from './ButtonColumn';

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
    key: 'rates',
    render: (text: string, record: Order): ReactElement => {
      return <RatesColumn record={record} />;
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
