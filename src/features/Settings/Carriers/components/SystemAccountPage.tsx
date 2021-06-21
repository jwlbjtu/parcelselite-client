import { SyncOutlined } from '@ant-design/icons';
import { Button, PageHeader, Table } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ClientAccount } from '../../../../custom_types/carrier-page';
import {
  fetchsClientAccountsHandler,
  selectCarriersLoading,
  selectClientAccounts
} from '../../../../redux/settings/carriersSlice';
import NoData from '../../../../shared/components/NoData';
import columns from './SystemCarrierTableCols';

const SystemAccountPage = (): ReactElement => {
  const dispatch = useDispatch();
  const loading = useSelector(selectCarriersLoading);
  const clientAccounts = useSelector(selectClientAccounts);

  useEffect(() => {
    dispatch(fetchsClientAccountsHandler());
  }, [dispatch]);

  return (
    <>
      <PageHeader
        extra={
          <Button
            icon={
              <SyncOutlined
                spin={loading}
                onClick={() => dispatch(fetchsClientAccountsHandler())}
              />
            }
          />
        }
      />
      <Table<ClientAccount>
        scroll={{ x: 1500 }}
        pagination={false}
        columns={columns}
        dataSource={clientAccounts}
        rowKey={(record: ClientAccount) => record.id}
        loading={loading}
        locale={{
          emptyText: <NoData />
        }}
        style={{ marginBottom: '50px' }}
      />
    </>
  );
};

export default SystemAccountPage;
