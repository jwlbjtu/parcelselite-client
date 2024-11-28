import {
  DeleteFilled,
  PrinterOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  PageHeader,
  Popconfirm,
  Space,
  Table,
  Tabs
} from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import moment from 'moment';
import {
  Label,
  UserShippingRecordsSearchQuery
} from '../../../custom_types/order-page';
import {
  cancelShippingRecord,
  fetchOrdersHandler,
  selectLoading,
  selectOrders
} from '../../../redux/orders/ordersSlice';
import NoData from '../../../shared/components/NoData';
import { CARRIERS } from '../../../shared/utils/constants';
import columns, {
  ShipmentStatus,
  ShippingRecord
} from '../components/TableColumns/columns';
import {
  downloadLabelsHandler,
  downloadShipmentForms,
  opentLabelUrlHandler
} from '../../../shared/utils/helpers';
import DownloadCSEButton from '../../../shared/components/DownloadCSVButton';

const { TabPane } = Tabs;

const OrdersPage = (): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectLoading);
  const [startDate, setStartDate] = React.useState<string>(
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = React.useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  const [searchStatus, setSearchStatus] = useState<string>(
    ShipmentStatus.FULFILLED
  );

  useEffect(() => {
    form.validateFields().then((values: any) => {
      const searchValues: UserShippingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status: searchStatus
      };
      console.log('search values:', searchValues);
      dispatch(fetchOrdersHandler(searchValues));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  //= ====================================
  const refreshRecords = async () => {
    form.resetFields();
    setStartDate(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
    dispatch(
      fetchOrdersHandler({
        startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        status: searchStatus
      })
    );
  };

  const searchRecords = async () => {
    form.validateFields().then((values: any) => {
      const searchValues: UserShippingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status: searchStatus
      };
      console.log('search values:', searchValues);
      dispatch(fetchOrdersHandler(searchValues));
    });
  };

  const tabChangeHandler = async (key: string) => {
    setSearchStatus(key);
  };

  const cancelLabelHandler = (record: ShippingRecord) => {
    form.validateFields().then((values: any) => {
      const searchValues: UserShippingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status: searchStatus
      };
      dispatch(cancelShippingRecord(searchValues, record));
    });
  };

  const generateCSVData = (data: ShippingRecord[]) => {
    return data.map((record, index) => {
      return {
        序号: index + 1,
        日期: dayjs(record.updatedAt).format('YYYY/MM/DD HH:mm:ss'),
        订单号: record.orderId,
        面单号: record.trackingId,
        收件人: record.toAddress.name,
        邮编: record.toAddress.zip,
        邮寄费: `$ ${record.rate.amount.toFixed(2)}`
      };
    });
  };

  return (
    <div>
      <PageHeader
        title={<FormattedMessage id="orders" />}
        extra={[
          <Button
            key="1"
            icon={<SyncOutlined spin={loading} />}
            onClick={refreshRecords}
          />,
          <Button
            key="create"
            type="primary"
            icon={<SearchOutlined />}
            onClick={searchRecords}
          >
            查询
          </Button>,
          <DownloadCSEButton
            label="导出订单"
            data={generateCSVData(orders)}
            fileName="订单记录"
          />
        ]}
      >
        <Form form={form} layout="horizontal">
          <Space direction="horizontal" size="middle">
            <Form.Item label="开始日期" name="startDate">
              <DatePicker
                defaultValue={moment(startDate)}
                onChange={(_, dateString) => {
                  // console.log('start date:', dateString);
                  setStartDate(dateString);
                }}
              />
            </Form.Item>
            <Form.Item label="结束日期" name="endDate">
              <DatePicker
                defaultValue={moment(endDate)}
                onChange={(_, dateString) => {
                  // console.log('start date:', dateString);
                  setEndDate(dateString);
                }}
              />
            </Form.Item>
            <Form.Item label="订单号" name="orderId">
              <Input type="text" placeholder="订单号" />
            </Form.Item>
            <Form.Item label="面单号" name="trackingId">
              <Input type="text" placeholder="面单号" />
            </Form.Item>
            <Form.Item label="收件人" name="name">
              <Input type="text" placeholder="收件人" />
            </Form.Item>
            <Form.Item label="电话" name="phone">
              <Input type="text" placeholder="电话" />
            </Form.Item>
            <Form.Item label="邮编" name="zip">
              <Input type="text" placeholder="邮编" />
            </Form.Item>
          </Space>
        </Form>
      </PageHeader>
      <Tabs defaultActiveKey="1" onChange={tabChangeHandler}>
        <Tabs.TabPane tab="已邮寄" key={ShipmentStatus.FULFILLED} />
        <Tabs.TabPane tab="待取消" key={ShipmentStatus.DEL_PENDING} />
        <Tabs.TabPane tab="已取消" key={ShipmentStatus.DELETED} />
      </Tabs>
      <Table<ShippingRecord>
        scroll={{ x: 'max-content' }}
        rowKey={(record: ShippingRecord) => record.id}
        columns={[
          ...columns,
          {
            title: '操作',
            dataIndex: 'labels',
            key: 'labels',
            render: (labels: Label[], record: ShippingRecord) => {
              return (
                <Space direction="vertical">
                  {ShipmentStatus.FULFILLED === record.status && (
                    <Button
                      type="primary"
                      icon={<PrinterOutlined />}
                      onClick={() =>
                        record.carrier === CARRIERS.RUI_YUN ||
                        record.carrier === CARRIERS.USPS3
                          ? opentLabelUrlHandler(record)
                          : downloadLabelsHandler(record)
                      }
                      ghost
                    >
                      打印面单
                    </Button>
                  )}
                  {record.forms && record.forms.length > 0 && (
                    <Button
                      type="primary"
                      icon={<PrinterOutlined />}
                      onClick={() => downloadShipmentForms(record)}
                      ghost
                    >
                      打印发票
                    </Button>
                  )}
                  {!dayjs(record.updatedAt).isBefore(
                    dayjs().subtract(1, 'day')
                  ) &&
                    (record.status === ShipmentStatus.FULFILLED ||
                      record.status === ShipmentStatus.DEL_PENDING) && (
                      <Popconfirm
                        key="确认删除"
                        title="确认删除?"
                        placement="topRight"
                        onConfirm={() => cancelLabelHandler(record)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button type="primary" icon={<DeleteFilled />} ghost>
                          申请取消
                        </Button>
                      </Popconfirm>
                    )}
                </Space>
              );
            }
          }
        ]}
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

// <Button
//   key="csv"
//   type="primary"
//   ghost
//   onClick={() =>
//     history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.CSV_IMPORT}`)
//   }
// >
//   <FormattedMessage id="uploadCsv" />
// </Button>,
// <Button
//   key="mannual"
//   type="primary"
//   ghost
//   onClick={() =>
//     history.push(`${UI_ROUTES.ORDERS}${UI_ROUTES.MANUAL}`)
//   }
// >
//   <FormattedMessage id="createLabel" />
// </Button>,
// <Button
//   key="manifest"
//   icon={<FileTextOutlined />}
//   type="primary"
//   ghost
//   disabled={
//     accounts.findIndex((ele) => ele.carrier === CARRIERS.DHL_ECOM) < 0
//   }
//   onClick={() =>
//     history.push(`${UI_ROUTES.SHIPMENTS}${UI_ROUTES.MANIFESTS}`)
//   }
// >
//   <FormattedMessage id="create_manifest" />
// </Button>
//
// const orderStatusTabChangeHandler = (activeKey: string) => {
//   if (activeKey === 'all') {
//     filterOrdersHandler({ orderStatus: undefined });
//   } else if (activeKey === 'unfulfilled') {
//     filterOrdersHandler({ orderStatus: OrderStatus.PENDING });
//   } else if (activeKey === 'fulfilled') {
//     filterOrdersHandler({ orderStatus: OrderStatus.FULFILLED });
//   }
// };

// const addressModalCancelHandler = () => {
//   dispatch(setPurchasingOrderId(undefined));
//   dispatch(setShowOrderAddressModal(false));
// };

// const filterOrdersHandler = (filter: Record<string, string | undefined>) => {
//   const newFilter = { ...orderFilter };
//   for (let i = 0; i < Object.keys(filter).length; i += 1) {
//     const key = Object.keys(filter)[i];
//     newFilter[key] = filter[key];
//   }
//   dispatch(setOrderFilter(newFilter));
//   dispatch(fetchOrdersHandler());
// };
