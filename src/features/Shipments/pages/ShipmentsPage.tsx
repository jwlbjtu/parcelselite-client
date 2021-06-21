import {
  DownloadOutlined,
  ExportOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Button, PageHeader, Table } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LabelStatus, Shipment } from '../../../custom_types/shipment-page';
import {
  fetchsClientAccountsHandler,
  selectClientAccounts
} from '../../../redux/settings/carriersSlice';
import { selectLabels } from '../../../redux/settings/settingSlice';
import {
  fetchShipmentsHandler,
  selectShipmentLoading,
  selectShipments,
  selectShowTrackingModal,
  selectTrackingInfo
} from '../../../redux/shipments/shipmentSlice';
import NoData from '../../../shared/components/NoData';
import {
  CARRIERS,
  LABEL_STATUS,
  UI_ROUTES
} from '../../../shared/utils/constants';
import { downloadLabelsHandler } from '../../../shared/utils/pdf.helpers';
import columns from '../components/ShipmentTableColumns';
import TrackingModal from '../components/TrackingModal';

const ShipmentsPage = (): ReactElement => {
  const dispatch = useDispatch();
  const history = useHistory();
  const shipments = useSelector(selectShipments);
  const systemAccounts = useSelector(selectClientAccounts);
  const loading = useSelector(selectShipmentLoading);
  const printFormat = useSelector(selectLabels);
  const showTrackingModal = useSelector(selectShowTrackingModal);
  const trackingInfo = useSelector(selectTrackingInfo);

  useEffect(() => {
    dispatch(fetchShipmentsHandler());
    dispatch(fetchsClientAccountsHandler());
  }, [dispatch]);

  const shipmentButonCol = {
    title: <FormattedMessage id="label_status" />,
    key: 'labelStatus',
    dataIndex: 'labelStatus',
    render: (labelStatus: LabelStatus, record: Shipment): ReactElement => {
      return (
        <div className="transation_table_cell">
          {labelStatus.status === LABEL_STATUS.ERROR ? (
            <Button icon={<QuestionCircleOutlined />}>View Error</Button>
          ) : (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() =>
                downloadLabelsHandler(
                  [record.label],
                  printFormat.labelSettings.format
                )
              }
            >
              <FormattedMessage id="download" />
            </Button>
          )}
        </div>
      );
    }
  };

  return (
    <div>
      <TrackingModal trackingInfo={trackingInfo} show={showTrackingModal} />
      <PageHeader
        title={<FormattedMessage id="shipments" />}
        extra={[
          <Button
            key="pickup"
            icon={<FieldTimeOutlined />}
            type="primary"
            ghost
            disabled
          >
            <FormattedMessage id="schedule_pickup" />
          </Button>,
          <Button
            key="export"
            icon={<ExportOutlined />}
            type="primary"
            ghost
            disabled
          >
            <FormattedMessage id="exportCsv" />
          </Button>,
          <Button
            key="manifest"
            icon={<FileTextOutlined />}
            type="primary"
            ghost
            disabled={
              systemAccounts.findIndex(
                (ele) => ele.carrier === CARRIERS.DHL_ECOM
              ) < 0
            }
            onClick={() =>
              history.push(`${UI_ROUTES.SHIPMENTS}${UI_ROUTES.MANIFESTS}`)
            }
          >
            <FormattedMessage id="create_manifest" />
          </Button>
        ]}
      />
      <Table
        rowKey={(record: Shipment) => record.id}
        columns={[...columns, shipmentButonCol]}
        dataSource={shipments}
        loading={loading}
        locale={{
          emptyText: <NoData />
        }}
      />
    </div>
  );
};

export default ShipmentsPage;
