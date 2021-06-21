import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, PageHeader, Spin } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Address } from '../../../../custom_types/address-page';

import '../../../../App.css';
import {
  fetchAddressesHandler,
  selectAddresses,
  selectPageLoading,
  setShowAddressModal
} from '../../../../redux/settings/addressSlice';
import AddressModal from '../components/AddressModal';
import NoData from '../../../../shared/components/NoData';
import AddressRow from '../components/AddressRow';

const AddressPage = (): ReactElement => {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const pageLoading = useSelector(selectPageLoading);
  const [modalData, setModalData] = useState<Address | undefined>();

  useEffect(() => {
    dispatch(fetchAddressesHandler());
  }, [dispatch]);

  const showAddressModalHandler = (data: Address | undefined) => {
    setModalData(data);
    dispatch(setShowAddressModal(true));
  };

  const addressModalCancelHandler = () => {
    dispatch(setShowAddressModal(false));
    setModalData(undefined);
  };

  return (
    <div>
      <AddressModal
        isSender
        address={modalData}
        onCancel={addressModalCancelHandler}
      />
      <PageHeader
        title={<FormattedMessage id="addresses" />}
        subTitle={<FormattedMessage id="addressSubtitle" />}
      />
      <Card
        title={<FormattedMessage id="locations" />}
        headStyle={{ backgroundColor: '#fbfbfb' }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showAddressModalHandler(undefined)}
            ghost
          >
            <FormattedMessage id="newAddress" />
          </Button>
        }
      >
        <Spin spinning={pageLoading}>
          {addresses && addresses.length > 0 ? (
            addresses.map((address) => {
              return (
                <AddressRow
                  key={address.id}
                  address={address}
                  showModal={showAddressModalHandler}
                />
              );
            })
          ) : (
            <NoData />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default AddressPage;
