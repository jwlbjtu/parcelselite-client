import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  PageHeader,
  Row,
  Select,
  Spin,
  Table
} from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import zh_CN from 'antd/es/date-picker/locale/zh_CN';
import en_US from 'antd/es/date-picker/locale/en_US';
import { FormattedDate } from 'react-intl';
import DatePicker from '../../../shared/components/DatePicker';
import { selectLanguage } from '../../../redux/i18n/intlSlice';
import { CARRIERS, LOCALES } from '../../../shared/utils/constants';
import {
  createManifestsHandler,
  fetchManifestShipmentHandler,
  fetchManifestsHandler,
  selectShipments,
  selectManifestLoading,
  selectManifests,
  selectShipmentLoading
} from '../../../redux/shipments/shipmentSlice';
import { Order } from '../../../custom_types/order-page';
import NoData from '../../../shared/components/NoData';
import { selectClientAccounts } from '../../../redux/settings/carriersSlice';
import { ClientAccount } from '../../../custom_types/carrier-page';
import ManifestItems from '../components/ManifestItems';

const { Option } = Select;

const ManifestPage = (): ReactElement => {
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage);
  const [shippingDate, setShippingDate] = useState(dayjs());
  const [carrier, setCarrierRef] = useState<ClientAccount | undefined>();
  const shipments = useSelector(selectShipments);
  const manifests = useSelector(selectManifests);
  const loading = useSelector(selectShipmentLoading);
  const manifestLoading = useSelector(selectManifestLoading);
  const clientAccounts = useSelector(selectClientAccounts);

  useEffect(() => {
    setShippingDate(dayjs());
    const defaultCarrier = clientAccounts.find(
      (ele) => ele.carrier === CARRIERS.DHL_ECOM
    );
    if (defaultCarrier) {
      setCarrierRef(defaultCarrier);

      dispatch(
        fetchManifestShipmentHandler(
          defaultCarrier.accountId,
          dayjs(shippingDate).format('YYYY-MM-DD')
        )
      );
      dispatch(
        fetchManifestsHandler(
          defaultCarrier.id,
          dayjs(shippingDate).format('YYYY-MM-DD')
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onDateChangedHandler = (date: Dayjs | null) => {
    if (!date || !carrier) return;
    setShippingDate(date);
    dispatch(
      fetchManifestShipmentHandler(carrier.accountId, date.format('YYYY-MM-DD'))
    );
    dispatch(fetchManifestsHandler(carrier.id, date.format('YYYY-MM-DD')));
  };

  const onCarrierChangeHandler = (value: string) => {
    const account = clientAccounts.find((ele) => ele.accountName === value);
    if (shippingDate && account) {
      setCarrierRef(account);
      dispatch(
        fetchManifestShipmentHandler(
          account.accountId,
          shippingDate.format('YYYY-MM-DD')
        )
      );
      dispatch(
        fetchManifestsHandler(account.id, shippingDate.format('YYYY-MM-DD'))
      );
    }
  };

  const groupShipmentsHandler = (
    data: Order[]
  ): { service: string; count: number }[] => {
    const result: Record<string, number> = {};
    data.forEach((ele) => {
      if (!result[ele.service!.name]) {
        result[ele.service!.name] = 1;
      } else {
        result[ele.service!.name] += 1;
      }
    });

    const counts = Object.keys(result).map((key) => {
      return { service: key, count: result[key] };
    });

    return counts;
  };

  const labelColumns = [
    {
      title: 'Service',
      key: 'service',
      dataIndex: 'service'
    },
    {
      title: 'Count',
      key: 'count',
      dataIndex: 'count'
    }
  ];

  const getCarrierAccountOptions = (
    accounts: ClientAccount[]
  ): ReactElement[] => {
    const result: ReactElement[] = [];
    for (let i = 0; i < accounts.length; i += 1) {
      const clientAccount = accounts[i];
      if (clientAccount.carrier === CARRIERS.DHL_ECOM) {
        result.push(
          <Option
            key={clientAccount.accountName}
            value={clientAccount.accountName}
          >
            {clientAccount.accountName}
          </Option>
        );
      }
    }
    return result;
  };

  return (
    <div>
      <PageHeader title="Manifests" />
      <Divider style={{ marginTop: '0px', marginBottom: '10px' }} />
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item label="邮寄日期">
            <DatePicker
              locale={language === LOCALES.CHINESE ? zh_CN : en_US}
              allowClear={false}
              style={{ width: '100%' }}
              defaultValue={dayjs()}
              onChange={onDateChangedHandler}
            />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item label="物流账号">
            <Select
              defaultValue={
                clientAccounts.find((ele) => ele.carrier === CARRIERS.DHL_ECOM)
                  ?.accountName
              }
              onChange={onCarrierChangeHandler}
            >
              {getCarrierAccountOptions(clientAccounts)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: '0px', marginBottom: '10px' }} />
      <Row gutter={100}>
        <Col span={12}>
          <div style={{ fontSize: '22px' }}>Unmanifested labels</div>
          <Card
            size="small"
            title={
              <FormattedDate
                value={dayjs(shippingDate).toISOString()}
                year="numeric"
                month="2-digit"
                day="2-digit"
              />
            }
            headStyle={{ backgroundColor: '#ddd' }}
          >
            <Spin spinning={loading}>
              {shipments.length === 0 ? (
                <div>没有可以 manifest 的面单</div>
              ) : (
                <>
                  <Table<{ service: string; count: number }>
                    rowKey={(record) => record.service}
                    columns={labelColumns}
                    dataSource={groupShipmentsHandler(shipments)}
                    size="small"
                    pagination={false}
                    locale={{
                      emptyText: <NoData />
                    }}
                  />
                  <Button
                    style={{ float: 'right', marginTop: '10px' }}
                    type="primary"
                    onClick={() =>
                      dispatch(
                        createManifestsHandler(
                          carrier?.id,
                          carrier?.accountId,
                          shippingDate.format('YYYY-MM-DD'),
                          shipments
                        )
                      )
                    }
                  >
                    生成 Manifest
                  </Button>
                </>
              )}
            </Spin>
          </Card>
        </Col>
        <Col span={12}>
          <div style={{ fontSize: '22px' }}>Manifest 记录</div>
          <Card
            size="small"
            title="Existing Manifest"
            headStyle={{ backgroundColor: '#ddd' }}
          >
            <Spin spinning={manifestLoading}>
              {manifests.length === 0 ? (
                <div>暂无 manifest</div>
              ) : (
                <ManifestItems manifests={manifests} />
              )}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManifestPage;
