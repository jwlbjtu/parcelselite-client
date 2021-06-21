import { Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { OrderAddress } from '../../../../custom_types/address-page';
import { UpdateData } from '../../../../custom_types/common';
import {
  selectLoading,
  selectShowOrderAddressModal,
  updateOrderHanlder
} from '../../../../redux/orders/ordersSlice';
import AddressForm from '../../../../shared/components/AddressForm';

interface OrderAddressModalProps {
  orderId: string;
  address: OrderAddress | undefined;
  type: string;
  onCancel: () => void;
}

const OrderAddressModal = ({
  orderId,
  address,
  type,
  onCancel
}: OrderAddressModalProps): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const showOrderAddressModal = useSelector(selectShowOrderAddressModal);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    form.resetFields();
  }, [form, address, type, orderId]);

  const formSubmitHandler = () => {
    form.validateFields().then((values: OrderAddress) => {
      const data: UpdateData = {
        id: orderId,
        [type]: values
      };
      dispatch(updateOrderHanlder(data));
    });
  };

  const onCancelHandler = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={<FormattedMessage id="editAddess" />}
      visible={showOrderAddressModal}
      closable={false}
      cancelText={<FormattedMessage id="cancel" />}
      onCancel={onCancelHandler}
      okText={<FormattedMessage id="apply" />}
      onOk={formSubmitHandler}
      okButtonProps={{ loading }}
    >
      <AddressForm form={form} address={address} />
    </Modal>
  );
};

export default OrderAddressModal;
