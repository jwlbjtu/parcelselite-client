import { Modal, Form, Checkbox, Button, Row, Col } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  Address,
  AddressCreateData
} from '../../../../custom_types/address-page';
import {
  createAddressHandler,
  deleteAddressHandler,
  selectAddresses,
  selectDeletingAddress,
  selectAddressLoading,
  selectShowAddressModal,
  updateAddressHandler
} from '../../../../redux/settings/addressSlice';
import AddressForm from '../../../../shared/components/AddressForm';

interface AddressModalProps {
  isSender: boolean;
  address: Address | undefined;
  onCancel: () => void;
}

const AddressModal = ({
  isSender,
  address,
  onCancel
}: AddressModalProps): ReactElement => {
  const dispatch = useDispatch();
  const showModal = useSelector(selectShowAddressModal);
  const addresses = useSelector(selectAddresses);
  const loading = useSelector(selectAddressLoading);
  const deleting = useSelector(selectDeletingAddress);
  const [form] = useForm();
  const [isDefaultSender, setIsDefaultSender] = useState<boolean>(
    addresses.length === 0
      ? true
      : address !== undefined && address.isDefaultSender
  );

  useEffect(() => {
    form.resetFields();
    setIsDefaultSender(
      addresses.length === 0
        ? true
        : address !== undefined && address.isDefaultSender
    );
  }, [form, address, showModal, addresses]);

  const handleCreate = (values: AddressCreateData) => {
    const data: AddressCreateData = {
      ...values
    };
    data.isDefaultSender = isDefaultSender;
    dispatch(createAddressHandler(data));
  };

  const handleUpdate = (values: AddressCreateData) => {
    if (address) {
      const data: Address = { ...address };
      Object.keys(values).forEach((key) => {
        data[key] = values[key];
      });
      data.isDefaultSender = isDefaultSender;
      dispatch(updateAddressHandler(data));
    }
  };

  const formSubmitHandler = () => {
    form.validateFields().then((values: AddressCreateData) => {
      if (address) {
        handleUpdate(values);
      } else {
        handleCreate(values);
      }
    });
  };

  const defaultSenderChangedHandler = (event: any) => {
    setIsDefaultSender(event.target.checked);
  };

  const onCancelHandler = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        address ? (
          <FormattedMessage id="editAddess" />
        ) : (
          <FormattedMessage id="newAddress" />
        )
      }
      visible={showModal}
      closable={false}
      footer={
        <div>
          <Row>
            <Col style={{ textAlign: 'left' }} span={15}>
              {address && !address.isDefaultSender ? (
                <Button
                  loading={deleting}
                  type="link"
                  onClick={() => dispatch(deleteAddressHandler(address.id))}
                >
                  <FormattedMessage id="deleteAddress" />
                </Button>
              ) : null}
            </Col>
            <Col span={9}>
              <Button onClick={onCancelHandler}>
                <FormattedMessage id="cancel" />
              </Button>
              <Button
                loading={loading}
                type="primary"
                onClick={formSubmitHandler}
              >
                <FormattedMessage id="apply" />
              </Button>
            </Col>
          </Row>
        </div>
      }
    >
      <AddressForm form={form} address={address} />
      {isSender && (
        <Form.Item name="isDefaultSender">
          <Checkbox
            onChange={defaultSenderChangedHandler}
            checked={isDefaultSender}
            disabled={
              addresses.length === 0 || (address && address.isDefaultSender)
            }
          >
            <FormattedMessage id="setDefaultSender" />
          </Checkbox>
        </Form.Item>
      )}
    </Modal>
  );
};

export default AddressModal;

//*

//   {Object.keys(STATES[Country.USA]).map((item) => {
//     return (
//       <Option key={item} value={item}>
//         {STATES[Country.USA][item]}
//       </Option>
//     );
//   })}
