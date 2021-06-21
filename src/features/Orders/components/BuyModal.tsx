import { Alert, Checkbox, Divider, Form, Image, Modal, Space, Tag } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../../custom_types/order-page';
import {
  selectPurchasing,
  selectShowBuyModal,
  setPurchasingOrderId,
  setShowBuyModal
} from '../../../redux/orders/ordersSlice';
import {
  purchaseOrderHandler,
  selectCurUser
} from '../../../redux/user/userSlice';
import { CARRIERS } from '../../../shared/utils/constants';
import { getCarrierIcon } from '../../../shared/utils/logo.helper';

interface BuyModalProps {
  order: Order;
}

const BuyModal = ({ order }: BuyModalProps): ReactElement => {
  const dispatch = useDispatch();
  const showModal = useSelector(selectShowBuyModal);
  const purchasing = useSelector(selectPurchasing);
  const curUser = useSelector(selectCurUser);
  const [agreeTerm, setAgreeTerm] = useState(false);

  useEffect(() => {
    setAgreeTerm(false);
  }, [order]);

  const agreeTermHandler = () => {
    setAgreeTerm(!agreeTerm);
  };

  const cancelHandler = () => {
    dispatch(setPurchasingOrderId(undefined));
    dispatch(setShowBuyModal(false));
    setAgreeTerm(false);
  };

  return (
    <Modal
      visible={showModal}
      closable={false}
      title={<FormattedMessage id="purchase_label" />}
      onCancel={cancelHandler}
      cancelText={<FormattedMessage id="cancel" />}
      okText={<FormattedMessage id="confirm_purchase" />}
      okButtonProps={{
        disabled:
          order.selectedRate === undefined ||
          order.selectedRate.rate === undefined ||
          curUser === undefined ||
          (!order.selectedRate.isTest &&
            curUser.balance < order.selectedRate.rate) ||
          (!order.selectedRate.isTest &&
            order.selectedRate.carrier === CARRIERS.DHL_ECOM &&
            !agreeTerm),
        loading: purchasing
      }}
      onOk={() => dispatch(purchaseOrderHandler(order))}
    >
      {curUser && order.selectedRate && order.selectedRate.rate && (
        <>
          <div style={{ marginBottom: '10px' }}>
            {order.selectedRate.isTest ? (
              <Alert
                style={{ marginBottom: '25px' }}
                message={<FormattedMessage id="no_fee_testing" />}
                type="info"
                showIcon
              />
            ) : (
              <>
                {curUser.balance < order.selectedRate.rate ? (
                  <Alert
                    style={{ marginBottom: '25px' }}
                    message={<FormattedMessage id="insufficient_fund" />}
                    type="error"
                    showIcon
                  />
                ) : null}
              </>
            )}
            <Space>
              <div>
                <Image
                  style={{ width: '40px', height: '40px' }}
                  src={getCarrierIcon(order.selectedRate.carrier)}
                  preview={false}
                />
              </div>
              <div>{`${order.selectedRate.carrier} ${order.selectedRate.service}`}</div>
            </Space>
            <Space style={{ float: 'right', marginTop: '10px' }}>
              {order.selectedRate.isTest && (
                <Tag>
                  <FormattedMessage id="testRate" />
                </Tag>
              )}
              <div>${order.selectedRate.rate.toFixed(2)}</div>
            </Space>
          </div>
          <Divider />
          <div>
            <div>
              <strong>
                <FormattedMessage id="item_total" />:
              </strong>
              <div style={{ float: 'right' }}>
                <strong>${order.selectedRate.rate.toFixed(2)}</strong>
              </div>
            </div>
            {!order.selectedRate.isTest &&
              order.selectedRate.carrier === CARRIERS.DHL_ECOM && (
                <>
                  <Alert
                    style={{ marginBottom: '5px', marginTop: '10px' }}
                    message={<FormattedMessage id="dhl_term" />}
                    type="warning"
                    showIcon
                  />
                  <Form.Item style={{ marginBottom: '0px' }}>
                    <Checkbox checked={agreeTerm} onChange={agreeTermHandler}>
                      <FormattedMessage id="aknowledge_terms" />
                    </Checkbox>
                  </Form.Item>
                </>
              )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default BuyModal;
