import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Result,
  Row,
  Spin
} from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import uniqid from 'uniqid';
import { Order } from '../../../custom_types/order-page';
import {
  selectOrders,
  setShowOrderAddressModal,
  setShowSelectAddressModal
} from '../../../redux/orders/ordersSlice';
import { OrderStatus, UI_ROUTES } from '../../../shared/utils/constants';
import ItemsCard from '../components/ItemsCard/ItemsCard';
import PackageInfoCard from '../components/PackageInfoCard';
import AddressCard from '../components/AddressCard/AddressCard';
import { OrderAddress } from '../../../custom_types/address-page';
import OrderAddressModal from '../components/AddressCard/OrderAddressModal';
import SelectAddressModal from '../components/AddressCard/SelectAddressModal';
import {
  downloadFormsHandler,
  downloadLabelsHandler,
  downloadPackSlipHandler
} from '../../../shared/utils/pdf.helpers';
import CustomDeclarationCard from '../components/CustomDeclarationCard/CustomDeclarationCard';
import { isOrderInternational } from '../../../shared/utils/helpers';
import ServiceCard from '../components/ServiceCard/ServiceCard';
import checkOrderRateErrors from '../../../shared/utils/order.helper';
import { purchaseOrderHandler } from '../../../redux/user/userSlice';
import { selectLabels } from '../../../redux/settings/settingSlice';

interface ParamType {
  orderId: string | undefined;
}

const OrderDetailPage = (): ReactElement => {
  const dispatch = useDispatch();
  const { orderId } = useParams<ParamType>();
  const orders = useSelector(selectOrders);
  const labelSettings = useSelector(selectLabels);
  const [curOrder, setCurOrder] = useState<Order | undefined>();
  const [loading, setLoading] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [curAddress, setCurAddress] = useState<OrderAddress | undefined>(
    undefined
  );
  const [addressType, setAddressType] = useState('');
  const [errors, setErrors] = useState<ReactElement[]>([]);
  const [isTest, setIsTest] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setCurAddress(undefined);
    setAddressType('');
    setIsTest(false);
    const order = orders.find((item) => item.id === orderId);
    setCurOrder(order);
    if (order && order.status !== OrderStatus.FULFILLED) {
      setErrors(checkOrderRateErrors(order, false));
    }
    setLoading(false);
  }, [orders, orderId]);

  const asReturnChangedHandler = (e: any) => {
    let checked = false;
    if (e.target.checked) {
      checked = true;
      // TODO: update order return address if change to true
    }
    setShowReturn(!checked);
  };

  const showAddressModalHandler = (data: OrderAddress, type: string) => {
    setCurAddress(data);
    setAddressType(type === 'recipient' ? 'toAddress' : type);
    dispatch(setShowOrderAddressModal(true));
  };

  const addressModalCancelHandler = () => {
    dispatch(setShowOrderAddressModal(false));
    setCurAddress(undefined);
    setAddressType('');
  };

  const showSelectAddressModalHand = (data: OrderAddress, type: string) => {
    setCurAddress(data);
    setAddressType(type === 'recipient' ? 'toAddress' : type);
    dispatch(setShowSelectAddressModal(true));
  };

  const selectAddressModalCancelHandler = () => {
    dispatch(setShowSelectAddressModal(false));
    setCurAddress(undefined);
    setAddressType('');
  };

  return (
    <div>
      <div>
        <Breadcrumb
          style={{ maxWidth: '200px', float: 'left', marginTop: '10px' }}
        >
          <Breadcrumb.Item>
            <Link to={UI_ROUTES.ORDERS}>
              <FormattedMessage id="orders" />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FormattedMessage id="orderDetails" />
          </Breadcrumb.Item>
        </Breadcrumb>
        {curOrder !== undefined && curOrder.status !== OrderStatus.FULFILLED && (
          <Button
            style={{ float: 'right', margin: '0 50px 20px 10px' }}
            type="primary"
            onClick={() => dispatch(purchaseOrderHandler(curOrder, isTest))}
            disabled={errors && errors.length > 0}
            loading={curOrder.labelLoading}
          >
            <FormattedMessage id="buy" />
          </Button>
        )}
        {curOrder !== undefined && (
          <>
            {((curOrder.items && curOrder.items.length > 0) ||
              (curOrder.customItems && curOrder.customItems.length > 0)) && (
              <Button
                style={
                  curOrder.status !== OrderStatus.FULFILLED
                    ? { float: 'right', margin: '0 10px 20px 10px' }
                    : { float: 'right', margin: '0 50px 20px 10px' }
                }
                type="primary"
                onClick={() =>
                  downloadPackSlipHandler(
                    curOrder,
                    labelSettings.packSlipSettings.format
                  )
                }
              >
                <FormattedMessage id="downloadPackSlip" />
              </Button>
            )}
            {curOrder.forms && curOrder.forms.length > 0 && (
              <Button
                style={{ float: 'right', margin: '0 10px 20px 10px' }}
                type="primary"
                onClick={() => downloadFormsHandler(curOrder.forms, 'standard')}
              >
                <FormattedMessage id="download_forms" />
              </Button>
            )}
            {curOrder.labels && curOrder.labels.length > 0 && (
              <Button
                style={{ float: 'right', margin: '0 10px 20px 10px' }}
                type="primary"
                onClick={() =>
                  downloadLabelsHandler(
                    curOrder.labels,
                    labelSettings.labelSettings.format
                  )
                }
              >
                <FormattedMessage id="download_labels" />
              </Button>
            )}
          </>
        )}
      </div>

      <Divider />
      <Spin spinning={loading} size="large" style={{ margin: 'auto' }}>
        <div>
          {curOrder ? (
            <>
              {errors.length > 0 && (
                <Alert
                  style={{ marginBottom: '25px' }}
                  message={<FormattedMessage id="label_unavailable" />}
                  description={
                    <div>
                      <strong>
                        <FormattedMessage id="fix_following" />:
                      </strong>
                      <ul>
                        {errors.map((ele, index) => (
                          <li key={`${uniqid(index.toString())}`}>{ele}</li>
                        ))}
                      </ul>
                    </div>
                  }
                  type="warning"
                  showIcon
                />
              )}
              {curOrder.errors && curOrder.errors.length > 0 && (
                <Alert
                  style={{ marginBottom: '25px' }}
                  message=""
                  description={
                    <ul>
                      {curOrder.errors.map((ele, index) => (
                        <li key={`${uniqid(index.toString())}`}>{ele}</li>
                      ))}
                    </ul>
                  }
                  type="error"
                />
              )}
              <Row gutter={20}>
                <Col span={12}>
                  <ServiceCard
                    order={curOrder}
                    isTest={isTest}
                    testHandler={setIsTest}
                  />
                  <div id="package-info">
                    <PackageInfoCard order={curOrder} />
                  </div>
                </Col>
                <Col span={12}>
                  {isOrderInternational(curOrder) && (
                    <CustomDeclarationCard order={curOrder} />
                  )}
                  <ItemsCard order={curOrder} />
                  <OrderAddressModal
                    orderId={curOrder.id}
                    address={curAddress}
                    type={addressType}
                    onCancel={addressModalCancelHandler}
                  />
                  <SelectAddressModal
                    orderId={curOrder.id}
                    address={curAddress}
                    type={addressType}
                    onCancel={selectAddressModalCancelHandler}
                  />
                  <AddressCard
                    order={curOrder}
                    address={curOrder.toAddress}
                    title="Recipient"
                    showModal={showAddressModalHandler}
                  />
                  <AddressCard
                    order={curOrder}
                    address={curOrder.sender}
                    title="Sender"
                    asReturn={!showReturn}
                    onChecked={asReturnChangedHandler}
                    showModal={showAddressModalHandler}
                    showSelectAddressModal={showSelectAddressModalHand}
                  />
                  {showReturn && (
                    <AddressCard
                      order={curOrder}
                      address={curOrder.return}
                      title="Return"
                      showModal={showAddressModalHandler}
                      showSelectAddressModal={showSelectAddressModalHand}
                    />
                  )}
                </Col>
              </Row>
            </>
          ) : (
            <Result status="warning" title="No Order Found" />
          )}
        </div>
      </Spin>
    </div>
  );
};

export default OrderDetailPage;
