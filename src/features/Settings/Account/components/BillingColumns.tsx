import React, { ReactElement } from 'react';
import { Image, Space } from 'antd';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import { getCarrierIcon } from '../../../../shared/utils/logo.helper';

import './BillingColumns.css';
import { getDisplayTracking } from '../../../../shared/utils/rates.helper';
import { Transaction } from '../../../../custom_types/billing-page';
import { isOrderInternational } from '../../../../shared/utils/helpers';

const renderCell = (
  text: number,
  record: Transaction
): ReactElement | string => {
  return text ? (
    <span style={{ color: record.addFund ? '#3f8600' : '#cf1322' }}>
      {text.toFixed(2)}
    </span>
  ) : (
    '-'
  );
};

const columns = [
  {
    title: <FormattedMessage id="dateTime" />,
    key: 'date',
    dataIndex: 'createdAt',
    render: (date: string): ReactElement => {
      return (
        <div className="transation_table_cell">
          <div>
            <FormattedDate
              value={new Date(date)}
              year="numeric"
              month="2-digit"
              day="2-digit"
            />
          </div>
          <div>
            <FormattedTime value={new Date(date)} />
          </div>
        </div>
      );
    }
  },
  {
    title: '物流账号',
    key: 'account',
    dataIndex: 'account'
  },
  {
    title: '账单说明',
    key: 'description',
    dataIndex: 'description',
    render: (description: string): ReactElement | string => {
      const data = description.split(', ');
      if (data.length === 1) {
        return description;
      }
      const [carrier, serviceName, tracking] = data;
      return (
        <Space size="small" className="transation_table_cell">
          {tracking ? (
            <>
              <Image
                preview={false}
                style={{ width: '24px', height: '24px' }}
                src={getCarrierIcon(carrier)}
              />{' '}
              <span>{getDisplayTracking(carrier, tracking, serviceName)}</span>
            </>
          ) : (
            '-'
          )}
        </Space>
      );
    }
  },
  {
    title: '邮寄费',
    key: 'total',
    dataIndex: 'total',
    render: renderCell
  }
];

export default columns;
