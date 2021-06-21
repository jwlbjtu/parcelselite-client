import {
  BarcodeOutlined,
  CheckOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import React, { ReactElement } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Order } from '../../../custom_types/order-page';
import {
  selectShowPurchasedModal,
  setPurchasingOrderId,
  setShowPurchasedModal
} from '../../../redux/orders/ordersSlice';
import { selectLabels } from '../../../redux/settings/settingSlice';
import { FILE_FORMAT_TEXTS } from '../../../shared/utils/constants';
import {
  downloadLabelsHandler,
  downloadPackSlipHandler
} from '../../../shared/utils/pdf.helpers';

interface PurchasedModalProps {
  order: Order;
}

const PurchasedModal = ({ order }: PurchasedModalProps): ReactElement => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const showModal = useSelector(selectShowPurchasedModal);
  const history = useHistory();
  const labelSettings = useSelector(selectLabels);

  const onCancelHandler = () => {
    dispatch(setPurchasingOrderId(undefined));
    dispatch(setShowPurchasedModal(false));
    history.push('/orders');
  };

  return (
    <Modal
      title={<FormattedMessage id="download_labels" />}
      closable={false}
      visible={showModal}
      footer={
        <Button onClick={onCancelHandler}>
          <FormattedMessage id="cancel" />
        </Button>
      }
    >
      <div
        style={{
          height: '60px',
          border: '1px solid #9fce52',
          borderLeft: '5px solid #9fce52',
          textAlign: 'center'
        }}
      >
        <div style={{ marginTop: '18px' }}>
          <Space>
            <CheckOutlined style={{ color: '#9fce52' }} /> 1{' '}
            <FormattedMessage id="label_prucahsed" />
          </Space>
        </div>
      </div>
      <div
        style={{
          minHeight: '150px',
          border: '1px solid #e4e5e6',
          marginTop: '10px'
        }}
      >
        <div
          style={{
            height: '60px',
            margin: '10px 10px 20px 10px'
          }}
        >
          <div>
            {intl.formatMessage({ id: 'shipping_labels' }).toUpperCase()}
          </div>
          <Space>
            <div>
              <BarcodeOutlined
                style={{
                  width: '40px',
                  height: '35px',
                  fontSize: '25px',
                  marginTop: '10px'
                }}
              />
            </div>
            <div>
              {FILE_FORMAT_TEXTS[labelSettings.labelSettings.format]}{' '}
              {labelSettings.labelSettings.type}{' '}
              <FormattedMessage id="shipping_labels" />
            </div>
          </Space>
          <div style={{ float: 'right', marginTop: '5px' }}>
            <Button
              type="primary"
              onClick={() =>
                downloadLabelsHandler(
                  order.labels,
                  labelSettings.labelSettings.format
                )
              }
            >
              <FormattedMessage id="download_doc" />
            </Button>
          </div>
        </div>
        <div
          style={{
            height: '60px',
            margin: '10px 10px 20px 10px'
          }}
        >
          <div>{intl.formatMessage({ id: 'packing_slip' })}</div>
          <Space>
            <div>
              <FileDoneOutlined
                style={{
                  width: '40px',
                  height: '35px',
                  fontSize: '25px',
                  marginTop: '10px'
                }}
              />
            </div>
            <div>
              {FILE_FORMAT_TEXTS[labelSettings.packSlipSettings.format]}{' '}
              {labelSettings.packSlipSettings.type}{' '}
              <FormattedMessage id="packing_slip" />
            </div>
          </Space>
          <div style={{ float: 'right', marginTop: '5px' }}>
            <Button
              type="primary"
              onClick={() =>
                downloadPackSlipHandler(
                  order,
                  labelSettings.packSlipSettings.format
                )
              }
            >
              <FormattedMessage id="download_doc" />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PurchasedModal;
