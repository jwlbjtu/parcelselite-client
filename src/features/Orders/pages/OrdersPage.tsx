import { FileTextOutlined } from '@ant-design/icons';
import { Button, Divider, PageHeader, Table, Tabs } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Order } from '../../../custom_types/order-page';
import {
  fetchOrdersHandler,
  selectLoading,
  selectOrderFilter,
  selectOrders,
  selectPurchasingOrderId,
  setOrderFilter,
  setPurchasingOrderId,
  setShowOrderAddressModal
} from '../../../redux/orders/ordersSlice';
import { selectClientAccounts } from '../../../redux/settings/carriersSlice';
import {
  selectShowTrackingModal,
  selectTrackingInfo
} from '../../../redux/shipments/shipmentSlice';
import NoData from '../../../shared/components/NoData';
import {
  CARRIERS,
  OrderStatus,
  UI_ROUTES
} from '../../../shared/utils/constants';
import TrackingModal from '../../Shipments/components/TrackingModal';
import OrderAddressModal from '../components/AddressCard/OrderAddressModal';
import columns from '../components/TableColumns/columns';

const { TabPane } = Tabs;

const OrdersPage = (): ReactElement => {
  const orders = useSelector(selectOrders);
  const purchasingOrderId = useSelector(selectPurchasingOrderId);
  const accounts = useSelector(selectClientAccounts);
  const loading = useSelector(selectLoading);
  const showTrackingModal = useSelector(selectShowTrackingModal);
  const trackingInfo = useSelector(selectTrackingInfo);
  const dispatch = useDispatch();
  const history = useHistory();
  const orderFilter = useSelector(selectOrderFilter);
  const [curOrder, setCurOrder] = useState<undefined | Order>();

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchOrdersHandler());
    }

    if (orders && purchasingOrderId) {
      setCurOrder(orders.find((ele) => ele.id === purchasingOrderId));
    } else {
      setCurOrder(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, purchasingOrderId]);

  const filterOrdersHandler = (filter: Record<string, string | undefined>) => {
    const newFilter = { ...orderFilter };
    for (let i = 0; i < Object.keys(filter).length; i += 1) {
      const key = Object.keys(filter)[i];
      newFilter[key] = filter[key];
    }
    dispatch(setOrderFilter(newFilter));
    dispatch(fetchOrdersHandler());
  };

  const orderStatusTabChangeHandler = (activeKey: string) => {
    if (activeKey === 'all') {
      filterOrdersHandler({ orderStatus: undefined });
    } else if (activeKey === 'unfulfilled') {
      filterOrdersHandler({ orderStatus: OrderStatus.PENDING });
    } else if (activeKey === 'fulfilled') {
      filterOrdersHandler({ orderStatus: OrderStatus.FULFILLED });
    }
  };

  const addressModalCancelHandler = () => {
    dispatch(setPurchasingOrderId(undefined));
    dispatch(setShowOrderAddressModal(false));
  };

  return (
    <div>
      {curOrder && (
        <OrderAddressModal
          orderId={curOrder.id}
          address={curOrder.toAddress}
          type="recipient"
          onCancel={addressModalCancelHandler}
        />
      )}
      <TrackingModal trackingInfo={trackingInfo} show={showTrackingModal} />
      <PageHeader
        title={<FormattedMessage id="orders" />}
        extra={[
          <Button
            key="csv"
            type="primary"
            ghost
            onClick={() =>
              history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.CSV_IMPORT}`)
            }
          >
            <FormattedMessage id="uploadCsv" />
          </Button>,
          <Button
            key="mannual"
            type="primary"
            ghost
            onClick={() =>
              history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.MANUAL}`)
            }
          >
            <FormattedMessage id="createLabel" />
          </Button>,
          <Button
            key="manifest"
            icon={<FileTextOutlined />}
            type="primary"
            ghost
            disabled={
              accounts.findIndex((ele) => ele.carrier === CARRIERS.DHL_ECOM) < 0
            }
            onClick={() =>
              history.push(`${UI_ROUTES.SHIPMENTS}${UI_ROUTES.MANIFESTS}`)
            }
          >
            <FormattedMessage id="create_manifest" />
          </Button>
        ]}
      />
      <Divider style={{ marginBottom: '0px' }} />
      <Tabs defaultActiveKey="all" onChange={orderStatusTabChangeHandler}>
        <TabPane tab="全部" key="all" />
        <TabPane tab="未完成" key="unfulfilled" />
        <TabPane tab="已完成" key="fulfilled" />
      </Tabs>
      <Table<Order>
        scroll={{ x: 'max-content' }}
        rowKey={(record: Order) => record.id}
        columns={columns}
        dataSource={orders}
        loading={loading}
        locale={{
          emptyText: <NoData />
        }}
      />
    </div>
  );
};

export default OrdersPage;
