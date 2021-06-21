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
  fetchLabelsHandler,
  fetchManifestsHandler,
  selectLabels,
  selectManifestLoading,
  selectManifests,
  selectShipmentLoading
} from '../../../redux/shipments/shipmentSlice';
import { Label } from '../../../custom_types/order-page';
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
  const labels = useSelector(selectLabels);
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
        fetchLabelsHandler(
          defaultCarrier.carrierRef,
          dayjs(shippingDate).format('YYYY-MM-DD')
        )
      );
      dispatch(
        fetchManifestsHandler(
          defaultCarrier.carrierRef,
          dayjs(shippingDate).format('YYYY-MM-DD')
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onDateChangedHandler = (date: Dayjs | null) => {
    if (!date || !carrier) return;
    setShippingDate(date);
    dispatch(fetchLabelsHandler(carrier.carrierRef, date.format('YYYY-MM-DD')));
    dispatch(
      fetchManifestsHandler(carrier.carrierRef, date.format('YYYY-MM-DD'))
    );
  };

  const groupLabelsHandler = (
    data: Label[]
  ): { service: string; count: number }[] => {
    const result: Record<string, number> = {};
    data.forEach((ele) => {
      if (!result[ele.service]) {
        result[ele.service] = 1;
      } else {
        result[ele.service] += 1;
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
    const accountSet = new Set();
    for (let i = 0; i < accounts.length; i += 1) {
      const clientAccount = accounts[i];
      if (
        !accountSet.has(clientAccount.carrierRef) &&
        clientAccount.carrier === CARRIERS.DHL_ECOM
      ) {
        accountSet.add(clientAccount.carrierRef);
        result.push(
          <Option value={clientAccount.carrierRef}>
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
        <Col span={6}>
          <Form.Item label="Shipping Date">
            <DatePicker
              locale={language === LOCALES.CHINESE ? zh_CN : en_US}
              allowClear={false}
              style={{ width: '100%' }}
              defaultValue={dayjs()}
              onChange={onDateChangedHandler}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Carrier Account">
            <Select
              defaultValue={
                clientAccounts.find((ele) => ele.carrier === CARRIERS.DHL_ECOM)
                  ?.carrierRef
              }
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
              {labels.length === 0 ? (
                <div>You have no label to manifest</div>
              ) : (
                <>
                  <Table<{ service: string; count: number }>
                    rowKey={(record) => record.service}
                    columns={labelColumns}
                    dataSource={groupLabelsHandler(labels)}
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
                          carrier?.carrier,
                          carrier?.carrierRef,
                          shippingDate.format('YYYY-MM-DD'),
                          labels
                        )
                      )
                    }
                  >
                    Create Manifest
                  </Button>
                </>
              )}
            </Spin>
          </Card>
        </Col>
        <Col span={12}>
          <div style={{ fontSize: '22px' }}>Manifest History</div>
          <Card
            size="small"
            title="Existing Manifest"
            headStyle={{ backgroundColor: '#ddd' }}
          >
            <Spin spinning={manifestLoading}>
              {manifests.length === 0 ? (
                <div>You have no manifest created</div>
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
