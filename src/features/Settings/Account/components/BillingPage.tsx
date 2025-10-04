import {
  ExportOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  PageHeader,
  Space,
  Table,
  Tabs
} from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import {
  Billing,
  Transaction,
  UserBillingRecordsSearchQuery
} from '../../../../custom_types/billing-page';
import {
  fetchTransactions,
  selectTransactions,
  selectTransactionTableLoading
} from '../../../../redux/billing/billingSlice';
import NoData from '../../../../shared/components/NoData';
import { ShipmentStatus } from '../../../Orders/components/TableColumns/columns';
import DownloadCSEButton from '../../../../shared/components/DownloadCSVButton';

const BillingPage = (): ReactElement => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const transations = useSelector(selectTransactions);
  const transationLoading = useSelector(selectTransactionTableLoading);
  const [startDate, setStartDate] = React.useState<string>(
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = React.useState<string>(
    dayjs().format('YYYY-MM-DD')
  );
  const [status, setStatus] = useState<string | undefined>();

  useEffect(() => {
    form.validateFields().then((values: any) => {
      const searchValues: UserBillingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status
      };
      console.log('search values:', searchValues);
      dispatch(fetchTransactions(searchValues));
    });
  }, [dispatch, status, startDate, endDate, form]);

  const refreshRecords = async () => {
    form.resetFields();
    setStartDate(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
    setEndDate(dayjs().format('YYYY-MM-DD'));
    dispatch(
      fetchTransactions({
        startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        status
      })
    );
    // dispatch(fetchUsersByRoleHandler(USER_ROLES.API_USER));
  };

  const searchRecords = async () => {
    form.validateFields().then((values: any) => {
      const searchValues: UserBillingRecordsSearchQuery = {
        ...values,
        startDate,
        endDate,
        status
      };
      console.log('search values:', searchValues);
      dispatch(fetchTransactions(searchValues));
    });
  };

  const renderCell = (text: number, record: Billing) => {
    return text ? (
      <span style={{ color: record.addFund ? '#3f8600' : '#cf1322' }}>
        {text.toFixed(2)}
      </span>
    ) : (
      '-'
    );
  };

  const tabChangeHandler = (key: string) => {
    if (key === ShipmentStatus.DELETED) {
      setStatus(ShipmentStatus.DELETED);
    } else {
      setStatus(undefined);
    }
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '日期',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (date: string) => {
        return (
          <Space direction="vertical" size="small">
            <div>{dayjs(date).format('YYYY/MM/DD')}</div>
            <div>{dayjs(date).format('HH:mm:ss')}</div>
          </Space>
        );
      }
    },
    {
      title: '物流账号',
      key: 'account',
      dataIndex: 'account'
    },
    {
      title: '订单号',
      key: 'description',
      dataIndex: 'description'
    },
    // {
    //   title: '邮寄费用',
    //   key: 'shippingCost',
    //   dataIndex: 'shippingCost',
    //   render: (text: string, record: Billing) => {
    //     if (record.details && record.details.shippingCost) {
    //       const { amount } = record.details.shippingCost;
    //       return renderCell(amount, record);
    //     }
    //     return '-';
    //   }
    // },
    // {
    //   title: '手续费',
    //   key: 'fee',
    //   dataIndex: 'fee',
    //   render: (text: string, record: Billing) => {
    //     if (record.details && record.details.fee) {
    //       const { amount } = record.details.fee;
    //       return renderCell(amount, record);
    //     }
    //     return '-';
    //   }
    // },
    {
      title: '邮寄费用',
      key: 'total',
      dataIndex: 'total',
      render: renderCell
    }
    // {
    //   title: '押金变化',
    //   key: 'deposit',
    //   dataIndex: 'deposit',
    //   render: renderCell
    // },
    // {
    //   title: '余额',
    //   key: 'balance',
    //   dataIndex: 'balance',
    //   render: (value: number) => value.toFixed(2)
    // },
    // {
    //   title: '押金',
    //   key: 'clientDeposit',
    //   dataIndex: 'clientDeposit',
    //   render: (value: number) => (value !== undefined ? value.toFixed(2) : '-')
    // }
  ];

  const generateCSVData = (data: Billing[]) => {
    return data.map((record, index) => {
      return {
        序号: index + 1,
        日期: dayjs(record.updatedAt).format('YYYY/MM/DD HH:mm:ss'),
        物流账号: record.account,
        订单号: record.description,
        邮寄费用: record.total
      };
    });
  };

  return (
    <div>
      <PageHeader
        title={<FormattedMessage id="allTransactions" />}
        extra={[
          <Button
            key="1"
            icon={<SyncOutlined spin={transationLoading} />}
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
            label="导出账单"
            data={generateCSVData(transations)}
            fileName="账单记录"
            header="序号,日期,物流账号,订单号,邮寄费用"
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
              <Input type="text" placeholder="订单号" style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="物流渠道" name="channel">
              <Input type="text" placeholder="物流渠道" />
            </Form.Item>
          </Space>
        </Form>
      </PageHeader>
      <Tabs defaultActiveKey="1" onChange={tabChangeHandler}>
        <Tabs.TabPane tab="已扣款" key={ShipmentStatus.FULFILLED} />
        <Tabs.TabPane tab="已取消" key={ShipmentStatus.DELETED} />
      </Tabs>
      <Table
        rowKey={(record: Billing) => record.id}
        columns={columns}
        dataSource={transations}
        loading={transationLoading}
        locale={{
          emptyText: <NoData />
        }}
      />
    </div>
  );
};

export default BillingPage;
