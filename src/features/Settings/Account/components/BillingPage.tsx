import { ExportOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, PageHeader, Table } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Transaction } from '../../../../custom_types/billing-page';
import {
  fetchTransactions,
  selectTransactions,
  selectTransactionTableLoading
} from '../../../../redux/billing/billingSlice';
import NoData from '../../../../shared/components/NoData';
import columns from './BillingColumns';

const BillingPage = (): ReactElement => {
  const dispatch = useDispatch();
  const transations = useSelector(selectTransactions);
  const transationLoading = useSelector(selectTransactionTableLoading);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div>
      <PageHeader
        title={<FormattedMessage id="allTransactions" />}
        extra={[
          <Button
            icon={<SyncOutlined />}
            onClick={() => dispatch(fetchTransactions())}
          />,
          <Button icon={<ExportOutlined />} type="primary" ghost disabled>
            <FormattedMessage id="exportCsv" />
          </Button>
        ]}
      />
      <Table
        rowKey={(record: Transaction) => record.id}
        columns={columns}
        dataSource={transations}
        loading={transationLoading}
        locale={{
          emptyText: <NoData />
        }}
      />
    </div>
  );
};

export default BillingPage;
