import {
  Breadcrumb,
  Button,
  Card,
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
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import zh_CN from 'antd/es/date-picker/locale/zh_CN';
import en_US from 'antd/es/date-picker/locale/en_US';
import { Order } from '../../../custom_types/order-page';
import {
  selectLoading,
  selectOrders,
  setShowBuyModal,
  setShowOrderAddressModal,
  setShowSelectAddressModal,
  updateOrderHanlder
} from '../../../redux/orders/ordersSlice';
import {
  LOCALES,
  OrderStatus,
  UI_ROUTES
} from '../../../shared/utils/constants';
import ItemsCard from '../components/ItemsCard/ItemsCard';
import PackageInfoCard from '../components/PackageInfoCard';
import DatePicker from '../../../shared/components/DatePicker';
import AddressCard from '../components/AddressCard/AddressCard';
import { OrderAddress } from '../../../custom_types/address-page';
import OrderAddressModal from '../components/AddressCard/OrderAddressModal';
import SelectAddressModal from '../components/AddressCard/SelectAddressModal';
import RatesCard from '../components/RatesCard/RatesCard';
import BuyModal from '../components/BuyModal';
import PurchasedModal from '../components/PurchasedModal';
import { selectLanguage } from '../../../redux/i18n/intlSlice';
import CustomDeclarationCard from '../components/CustomDeclarationCard/CustomDeclarationCard';
import { isOrderInternational } from '../../../shared/utils/helpers';

interface ParamType {
  orderId: string | undefined;
}

const OrderDetailPage = (): ReactElement => {
  const dispatch = useDispatch();
  const { orderId } = useParams<ParamType>();
  const orders = useSelector(selectOrders);
  const orderLoading = useSelector(selectLoading);
  const language = useSelector(selectLanguage);
  const [curOrder, setCurOrder] = useState<Order | undefined>();
  const [loading, setLoading] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [curAddress, setCurAddress] = useState<OrderAddress | undefined>(
    undefined
  );
  const [addressType, setAddressType] = useState('');

  useEffect(() => {
    setLoading(true);
    setCurAddress(undefined);
    setAddressType('');
    const order = orders.find((item) => item.id === orderId);
    setCurOrder(order);
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
    setAddressType(type);
    dispatch(setShowOrderAddressModal(true));
  };

  const addressModalCancelHandler = () => {
    dispatch(setShowOrderAddressModal(false));
    setCurAddress(undefined);
    setAddressType('');
  };

  const showSelectAddressModalHand = (data: OrderAddress, type: string) => {
    setCurAddress(data);
    setAddressType(type);
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
        {curOrder !== undefined && (
          <Button
            disabled={
              curOrder.selectedRate === undefined ||
              curOrder.rates === undefined ||
              curOrder.rates.length === 0
            }
            style={{ float: 'right', margin: '0 50px 20px 10px' }}
            type="primary"
            onClick={() => dispatch(setShowBuyModal(true))}
          >
            {curOrder.orderStatus === OrderStatus.FULFILLED ? (
              <FormattedMessage id="buy_again" />
            ) : (
              <FormattedMessage id="buy" />
            )}
          </Button>
        )}
      </div>

      <Divider />
      <Spin spinning={loading} size="large" style={{ margin: 'auto' }}>
        <div>
          {curOrder ? (
            <>
              <BuyModal order={curOrder} />
              <PurchasedModal order={curOrder} />
              <Row gutter={20}>
                <Col span={12}>
                  {isOrderInternational(curOrder) && (
                    <CustomDeclarationCard order={curOrder} />
                  )}
                  <ItemsCard order={curOrder} />
                  <div id="package-info">
                    <PackageInfoCard order={curOrder} />
                  </div>
                  <Card size="small" style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>
                        <FormattedMessage id="shipment_options" />
                      </strong>
                    </div>
                    <div
                      style={
                        dayjs(curOrder.shipmentOptions.shipmentDate).isBefore(
                          dayjs(),
                          'day'
                        )
                          ? { color: 'red' }
                          : {}
                      }
                    >
                      <FormattedMessage id="shipment_date" />
                    </div>
                    <Spin spinning={orderLoading}>
                      <DatePicker
                        locale={language === LOCALES.CHINESE ? zh_CN : en_US}
                        allowClear={false}
                        style={{ minWidth: '188px' }}
                        defaultValue={dayjs(
                          curOrder.shipmentOptions.shipmentDate
                        )}
                        disabledDate={(currentDate) =>
                          currentDate.isBefore(dayjs(), 'day')
                        }
                        onChange={(value) => {
                          dispatch(
                            updateOrderHanlder({
                              id: curOrder.id,
                              shipmentOptions: { shipmentDate: value }
                            })
                          );
                        }}
                      />
                    </Spin>
                  </Card>
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
                    address={curOrder.recipient}
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
                <Col span={12}>
                  <RatesCard order={curOrder} />
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
