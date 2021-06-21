import { Modal } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Address, OrderAddress } from '../../../../custom_types/address-page';
import { UpdateData } from '../../../../custom_types/common';
import {
  selectLoading,
  selectShowSelectAddressModal,
  updateOrderHanlder
} from '../../../../redux/orders/ordersSlice';
import { selectAddresses } from '../../../../redux/settings/addressSlice';
import SelectAddressRow from './SelectAddressRow';

interface SelectAddressModalProps {
  orderId: string;
  address: OrderAddress | undefined;
  type: string;
  onCancel: () => void;
}

const SelectAddressModal = ({
  orderId,
  address,
  type,
  onCancel
}: SelectAddressModalProps): ReactElement => {
  const dispatch = useDispatch();
  const showSelectAddressModal = useSelector(selectShowSelectAddressModal);
  const addresses = useSelector(selectAddresses);
  const [curAddress, setCurAddress] = useState(address);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    setCurAddress(address);
  }, [address]);

  const checkAddressMatch = (
    address1: Address | OrderAddress | undefined,
    address2: Address | OrderAddress
  ) => {
    if (!address1) return false;
    const keysArray = Object.keys(address1);
    for (let i = 0; i < keysArray.length; i += 1) {
      const key = keysArray[i];
      if (key !== 'id') {
        if (address1[key] !== address2[key]) return false;
      }
    }
    return true;
  };

  const onOKHandler = () => {
    const data: UpdateData = {
      id: orderId,
      [type]: curAddress
    };
    dispatch(updateOrderHanlder(data));
  };

  return (
    <Modal
      width="600px"
      title="Select Addresses"
      visible={showSelectAddressModal}
      closable={false}
      cancelText={<FormattedMessage id="cancel" />}
      onCancel={onCancel}
      okText={<FormattedMessage id="apply" />}
      okButtonProps={{ loading }}
      onOk={onOKHandler}
    >
      <div
        style={{ maxHeight: '800px', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {addresses.map((item) => {
          return (
            <SelectAddressRow
              key={item.id}
              address={item}
              selected={checkAddressMatch(curAddress, item)}
              onClick={() => setCurAddress(item)}
            />
          );
        })}
      </div>
    </Modal>
  );
};

export default SelectAddressModal;
